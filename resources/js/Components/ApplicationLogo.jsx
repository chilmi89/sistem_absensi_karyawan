import '@/../css/ApplicationLogo.css';

export default function ApplicationLogo({
    width = '60px',      // default width
    height = '46px',     // default height
    className = '',
    style = {},
    ...props
}) {
    return (
        <img
            src="/img/logo.png"
            alt="Logo Aplikasi"
            className={`application-logo ${className}`}
            style={{
                width,
                height,
                ...style, // bisa override semua style
            }}
            {...props}
        />
    );
}
