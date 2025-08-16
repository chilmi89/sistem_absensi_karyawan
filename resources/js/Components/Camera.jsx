    import React, { useRef, useEffect, useState } from "react";
    import jsQR from "jsqr";
    import { Notyf } from "notyf";
    import "notyf/notyf.min.css";
    import "@/../css/CameraQR.css";

    export default function CameraQR({ height = 400, onScan, isSidebarOpen = false, sidebarWidth = 250 }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(document.createElement("canvas"));
    const [error, setError] = useState(null);
    const [scanned, setScanned] = useState(false);
    const wrapperRef = useRef(null);
    const [cameraWidth, setCameraWidth] = useState("80%");

    const notyf = new Notyf({
        duration: 5000,
        dismissible: true,
        position: { x: "right", y: "top" },
    });

    useEffect(() => {
        const handleResize = () => {
        if (wrapperRef.current) {
            const availableWidth = window.innerWidth - (isSidebarOpen ? sidebarWidth : 0);
            setCameraWidth(`${Math.min(wrapperRef.current.parentElement.clientWidth, availableWidth - 32)}px`);
        }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isSidebarOpen, sidebarWidth]);

    useEffect(() => {
        let animationFrameId;
        let streamTracks = [];

        async function startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            streamTracks = stream.getTracks();

            if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.setAttribute("playsinline", true);
            await videoRef.current.play();
            }

            const scan = () => {
            if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
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
                streamTracks.forEach(track => track.stop());
                sendScanToAPI(code.data);
                return;
                }
            }
            animationFrameId = requestAnimationFrame(scan);
            };

            scan();
        } catch (err) {
            setError("Gagal mengakses kamera: " + err.message);
            notyf.error("Gagal mengakses kamera");
        }
        }

        startCamera();

        return () => {
        cancelAnimationFrame(animationFrameId);
        streamTracks.forEach(track => track.stop());
        };
    }, [scanned]);

    const sendScanToAPI = async (token) => {
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
            body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
            notyf.error(data.message || "QR Code tidak valid");
        } else if (data.data) {
            const d = data.data;
            notyf.success(`Absensi berhasil untuk ${d.nama}`);
            onScan && onScan(d, true);
        } else {
            notyf.success(data.message || "QR Code berhasil");
        }
        } catch (err) {
        console.error(err);
        notyf.error("Terjadi kesalahan saat scan");
        }
    };

    return (
        <div
        ref={wrapperRef}
        className="camera-wrapper"
        style={{
            width: cameraWidth,
            height,
            transition: 'width 0.3s ease-in-out',
            marginLeft: isSidebarOpen ? `${sidebarWidth}px` : '0',
            transform: isSidebarOpen ? `translateX(${sidebarWidth}px)` : 'translateX(0)',
        }}
        >
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-video"
        />
        {error && <p className="camera-error">{error}</p>}
        </div>
    );
    }
