import { useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'

export default function QRScanner({ onScan }) {
  const videoRef = useRef(null)
  const scannerRef = useRef(null)
  const [facing, setFacing] = useState('environment')
  const [multiCam, setMultiCam] = useState(false)

  useEffect(() => {
    if (!videoRef.current) return

    const scanner = new QrScanner(
      videoRef.current,
      (result) => onScan(result.data),
      {
        preferredCamera: facing,
        highlightScanRegion: false,
        highlightCodeOutline: false,
        maxScansPerSecond: 30,
        returnDetailedScanResult: true,
      }
    )
    scannerRef.current = scanner

    scanner.start()
      .then(() => {
        // gọi sau khi scanner đã start để tránh tạo stream tạm
        QrScanner.listCameras(true).then((cams) => setMultiCam(cams.length > 1))
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') console.error(err)
      })

    return () => {
      scanner.stop()
      scanner.destroy()
    }
  }, [facing, onScan])

  return (
    <div className="scanner-container">
      <video ref={videoRef} className="scanner-video" muted playsInline />

      <div className="scanner-overlay">
        <div className="scanner-frame">
          <span className="corner-br" />
          <span className="corner-bl" />
          <div className="scan-line" />
        </div>
        <p className="scanner-hint">Đưa mã QR / barcode vào khung</p>
      </div>

      {multiCam && (
        <button
          className="cam-flip-btn"
          onClick={() => setFacing((f) => (f === 'environment' ? 'user' : 'environment'))}
          title="Xoay camera"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7h-9" /><path d="M14 17H5" />
            <circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
          </svg>
        </button>
      )}
    </div>
  )
}
