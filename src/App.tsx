import { ChangeEvent, useRef, useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle, Input, IconButton } from "@mui/material";
import { QrCodeScanner } from '@mui/icons-material';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { toDataURL } from 'qrcode';

export default () => {
  const ctrl: { scan?: Promise<IScannerControls> } = {}
  const inputRef = useRef<HTMLInputElement>(null)
  const [scan, SCAN] = useState(false);
  const [qr, QR] = useState(['']);
  const codeReader = useMemo(() => new BrowserQRCodeReader(new Map().set(2, [11]), { delayBetweenScanAttempts: 100, delayBetweenScanSuccess: 100 }), []);
  const toggleScan = () => {
    if (scan) { BrowserQRCodeReader.releaseAllStreams(); SCAN(false) }
    else { SCAN(true); ctrl.scan = codeReader.decodeFromVideoDevice(void 0, 'video', (data: any) => data && ctrl.scan!.then((s) => (s.stop(), SCAN(false), QR(['']), inputRef.current!.value = data!.getText()))) }
  }
  return <Dialog open fullWidth>
    <DialogTitle display='flex'>
      <IconButton key='scanner' onClick={toggleScan} children={<QrCodeScanner color='primary' />} />
    </DialogTitle>
    <DialogContent>
      <Input fullWidth inputRef={inputRef} placeholder={'CONTEXT'} onChange={(e: ChangeEvent<HTMLInputElement>) => toDataURL(e.target!.value, { margin: 1, scale: 16 }).then((data) => {
        QR([data])
      }).catch(() => { })} />
      {scan ? <video id="video" style={{ width: '100%' }} /> : qr.map((src, i) => <img key={src + i} style={{ width: '100%' }} src={src} />)}
    </DialogContent>
  </Dialog>
}