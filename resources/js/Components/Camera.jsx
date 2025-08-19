import React, { useRef, useEffect, useState } from "react";
import jsQR from "jsqr";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

export default function CameraQR({ height = 370, onScan, selectedDate, isSidebarOpen = false }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(document.createElement("canvas"));
    const wrapperRef = useRef(null);
    const streamRef = useRef(null);

    const [error, setError] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [cameraWidth, setCameraWidth] = useState("90%");

    const notyf = new Notyf({
        position: { x: "right", y: "top" },
        duration: 3000,
        ripple: true,
    });

    // Resize kamera sesuai wrapper + sidebar
    useEffect(() => {
        const handleResize = () => {
            if (wrapperRef.current) {
                const parentWidth = wrapperRef.current.parentElement.clientWidth;
                const sidebarOffset = isSidebarOpen ? 240 : 0; // sesuaikan lebar sidebar
                const newWidth = parentWidth - sidebarOffset;
                setCameraWidth(`${newWidth}px`);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isSidebarOpen]);

    // Start kamera
    useEffect(() => {
        if (!selectedDate) return;
        if (scanned) return;

        let animationFrameId;

        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                });
                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.setAttribute("playsinline", true);
                    await videoRef.current.play();
                }

                const scan = () => {
                    if (
                        videoRef.current &&
                        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA
                    ) {
                        const video = videoRef.current;
                        const canvas = canvasRef.current;
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const code = jsQR(imageData.data, canvas.width, canvas.height);

                        if (code && !scanned) {
                            setScanned(true);
                            stopCamera();
                            sendScanToAPI(code.data);
                            return;
                        }
                    }
                    animationFrameId = requestAnimationFrame(scan);
                };

                scan();
            } catch (err) {
                setError("Gagal mengakses kamera");
                notyf.error("Gagal mengakses kamera: " + err.message);
            }
        }

        startCamera();

        const stopCamera = () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }
        };

        return () => {
            cancelAnimationFrame(animationFrameId);
            stopCamera();
        };
    }, [selectedDate, scanned]);

    const sendScanToAPI = async (token) => {
        if (!selectedDate) {
            notyf.error("Admin belum memilih tanggal. Tidak bisa scan QR!");
            setScanned(false);
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            if (!csrfToken) throw new Error("CSRF token tidak ditemukan");

            const res = await fetch("/absensi/scan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({ token, tanggal: selectedDate }),
            });

            const data = await res.json();

            if (!res.ok) {
                notyf.error(data.message || "QR Code tidak valid");
                setScanned(false);
            } else if (data.data) {
                const d = data.data;
                notyf.success(`Absensi Berhasil: ${d.nama}`);
                onScan && onScan(d, true);
            } else {
                notyf.success(data.message || "QR Code berhasil");
            }
        } catch (err) {
            console.error(err);
            notyf.error(err.message || "Terjadi kesalahan saat scan");
            setScanned(false);
        }
    };

    return (
        <div
            ref={wrapperRef}
            className="camera-wrapper relative"
            style={{ width: cameraWidth, height, maxWidth: "90%" }}
        >
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
                style={{
                    width: "100%",      // video mengikuti wrapper
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                    display: "block",
                }}
            />
            {!selectedDate && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-yellow-400 text-center p-4 rounded-lg">
                    Admin harus memilih tanggal terlebih dahulu
                </div>
            )}
            {error && <p style={{ color: "red", marginTop: "4px" }}>{error}</p>}

            <style>{`
        .camera-wrapper {
          border-radius: 12px;
          padding: 4px;
          background: linear-gradient(270deg, #ff0000, #00ff00, #0000ff, #ff0000);
          background-size: 580% 580%;
          max-width: 90%;
          animation: borderMove 6s linear infinite;
        }
        .camera-video {
          width: 100%;
          height: 120%;
          border-radius: 8px;
          object-fit: cover;
          display: block;
        }
        @keyframes borderMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
        </div>
    );
}
