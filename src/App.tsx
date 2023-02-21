import { ReactNode, ChangeEvent, useEffect, useRef, useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle, Link, Input, IconButton } from "@mui/material";
import { QrCodeScanner } from '@mui/icons-material';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { toDataURL } from 'qrcode';

const Frame = (props: { open?: boolean, children?: ReactNode, buttons?: ReactNode[] }) => {
  return <Dialog open={props.open ?? true} fullWidth>
    <DialogTitle display='flex'>
      <Link href='/' flexGrow={1}>QRcode</Link>
      {props.buttons?.map((b: ReactNode) => b)}
    </DialogTitle>
    <DialogContent>{props.children}</DialogContent>
  </Dialog>;
}

export default () => {
  const ctrl: { scan?: Promise<IScannerControls> } = {}
  const inputRef = useRef<HTMLInputElement>(null)
  const [scan, SCAN] = useState(false);
  const [qr, QR] = useState(['']);
  const codeReader = useMemo(() => new BrowserQRCodeReader(new Map().set(2, [11]), { delayBetweenScanAttempts: 100, delayBetweenScanSuccess: 100 }), []);
  const toggleScan = () => {
    if (scan) (SCAN(false), navigator.mediaDevices.getUserMedia().then((m) => m.getTracks()[1].stop()))
    else (SCAN(true), ctrl.scan = codeReader.decodeFromVideoDevice(void 0, 'video', handleScan))
  }
  const handleScan = (s: any) => {
    const data = s?.getText() ?? ''
    if (data) {
      ctrl.scan!.then((s) => (s.stop(), SCAN(false)))
      inputRef.current!.value = data
    }
  }
  return <Frame buttons={[<IconButton key='scanner' onClick={toggleScan} children={<QrCodeScanner color='primary' />} />]}>
    <Input fullWidth inputRef={inputRef} placeholder={'CONTEXT'} onChange={(e: ChangeEvent<HTMLInputElement>) => toDataURL(e.target!.value).then((data) => { QR([data]) })} />
    {scan ? <video id="video" style={{ width: '100%' }} /> : qr.map((src, i) => <img key={src + i} style={{ width: '100%' }} src={src} />)}
  </Frame>;
}