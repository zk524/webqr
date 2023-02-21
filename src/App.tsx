import { ChangeEvent, useRef, useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle, Input, IconButton } from "@mui/material";
import { QrCodeScanner, Share, Cameraswitch } from '@mui/icons-material';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { toDataURL } from 'qrcode';

const codeReader = new BrowserQRCodeReader(new Map().set(2, [11]), { delayBetweenScanAttempts: 100, delayBetweenScanSuccess: 100 })
export default () => {
  const ctrl: { mode: string } = { mode: 'user' }
  const inputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scan, SCAN] = useState(false);
  const [qr, QR] = useState(['']);
  const toggleScan = (on: boolean) => {
    const v = videoRef.current as HTMLVideoElement;
    (v!.srcObject as MediaStream)?.getTracks()?.[0]?.stop()
    on || !scan ? navigator.mediaDevices.getUserMedia({ video: { facingMode: ctrl.mode = ctrl.mode === 'environment' ? 'user' : 'environment', width: 400, height: 400 } }).then((m) => {
      SCAN(true), v!.srcObject = m, v!.play(), codeReader.decodeFromVideoElement(v, (d: any) => d && (QR(['']), inputRef.current!.value = d!.getText(), toggleScan(false)))
    }) : SCAN(false)
  }
  return <Dialog open fullWidth>
    <DialogTitle display='flex'>
      <IconButton key='scan' onClick={() => toggleScan(false)} children={<QrCodeScanner color='primary' />} />
      {scan && <IconButton key='switch' onClick={() => toggleScan(true)} children={<Cameraswitch color='primary' />} />}
      <IconButton onClick={() => { window.navigator.share({ url: window.location.href }) }} children={<Share color='primary' />} />
    </DialogTitle>
    <DialogContent>
      <Input fullWidth inputRef={inputRef} placeholder={'context'} onChange={(e: ChangeEvent<HTMLInputElement>) => Promise.all(e.target!.value!.match(/.{2048}|.+/g)?.map((v) => toDataURL(v, { margin: 0, scale: 16 })) ?? ['']).then(QR).catch(() => { })} />
      <video ref={videoRef} style={{ width: '100%', display: scan ? 'block' : 'none' }} />
      {!scan && qr.map((src, i) => <img key={src + i} style={{ width: '100%' }} src={src} />)}
    </DialogContent>
  </Dialog>
}