"use client";

import { useRef, useState } from "react";
import { createSolution } from "@/app/actions";
import type { Dict } from "@/lib/content";
import DrawPad, { type DrawLabels } from "./DrawPad";
import ModelView from "./ModelView";

type Labels = Pick<Dict, "dsHint" | "dsName" | "dsBody" | "dsSubmit" | "picLabel" | "picHint" | "picChoose" | "picChange" | "picRemove" | "picUploading" | "picErrType" | "picErrBig" | "picErrLimit" | "picErrFail" | "drawBtn" | "drawOn" | "modelLabel" | "modelHint" | "modelChoose" | "modelChange" | "modelRemove" | "modelErrType" | "modelErrBig" | "modelRotate" | "modelLoading"> & DrawLabels;

const MAX_SIDE = 1600;
const MAX_MODEL_BYTES = 10 * 1024 * 1024;

/** Shrinks a picture in the browser so uploads stay small on a phone connection. */
async function shrink(file: File): Promise<Blob | null> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return null;
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  // A white ground keeps transparent pictures readable once saved as JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
}

export default function PitchForm({ problemId, t }: { problemId: string; t: Labels }) {
  const [pic, setPic] = useState<{ id: string; url: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const [drawing, setDrawing] = useState(false);
  const [model, setModel] = useState<{ id: string; url: string } | null>(null);
  const [modelBusy, setModelBusy] = useState(false);
  const [modelError, setModelError] = useState("");
  const modelInput = useRef<HTMLInputElement>(null);

  /** A 3D model goes up as it is; only its size is checked here so the message is quick. */
  async function chooseModel(file: File | undefined) {
    if (!file) return;
    setModelError("");
    if (file.size > MAX_MODEL_BYTES) return setModelError(t.modelErrBig);
    setModelBusy(true);
    try {
      const body = new FormData();
      body.append("file", file, "model.glb");
      const res = await fetch("/api/files", { method: "POST", body });
      const saved = res.status === 201 ? ((await res.json()) as { id: string; url: string; kind: string }) : null;
      if (saved?.kind === "model") setModel({ id: saved.id, url: saved.url });
      else setModelError(res.status === 413 ? t.modelErrBig : res.status === 429 ? t.picErrLimit : res.status === 201 || res.status === 415 ? t.modelErrType : t.picErrFail);
    } catch {
      setModelError(t.picErrFail);
    } finally {
      setModelBusy(false);
      if (modelInput.current) modelInput.current.value = "";
    }
  }

  async function choose(file: File | undefined) {
    if (!file) return;
    const blob = await shrink(file);
    if (!blob) return setError(t.picErrType);
    await upload(blob);
  }

  /** Sends a picture (chosen or drawn) to the server and makes it this pitch's picture. */
  async function upload(blob: Blob) {
    setError("");
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", blob, "picture.jpg");
      const res = await fetch("/api/files", { method: "POST", body });
      if (res.status === 201) {
        const saved = (await res.json()) as { id: string; url: string };
        setPic({ id: saved.id, url: saved.url });
      } else setError(res.status === 413 ? t.picErrBig : res.status === 415 ? t.picErrType : res.status === 429 ? t.picErrLimit : t.picErrFail);
    } catch {
      setError(t.picErrFail);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <form
      className="form"
      action={async (data) => {
        await createSolution(data);
        setPic(null);
        setDrawing(false);
        setModel(null);
      }}
    >
      <input type="hidden" name="problemId" value={problemId} />
      <input type="hidden" name="imageId" value={pic?.id ?? ""} />
      <input type="hidden" name="modelId" value={model?.id ?? ""} />
      <p className="muted small">{t.dsHint}</p>
      <div className="field"><label htmlFor="sTitle">{t.dsName}</label><input type="text" id="sTitle" name="title" required minLength={6} maxLength={160} /></div>
      <div className="field"><label htmlFor="sBody">{t.dsBody}</label><textarea id="sBody" name="body" required minLength={60} maxLength={4000} /></div>

      <div className="field">
        <label htmlFor="sPic">{t.picLabel}</label>
        <span className="muted small">{t.picHint}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {pic && !drawing ? <img className="vis" src={pic.url} alt="" /> : null}
        {drawing ? (
          <DrawPad
            backgroundUrl={pic?.url}
            t={t}
            onCancel={() => setDrawing(false)}
            onDone={(blob) => {
              setDrawing(false);
              upload(blob);
            }}
          />
        ) : null}
        <input ref={input} className="filepick" type="file" tabIndex={-1} id="sPic" accept="image/png,image/jpeg,image/webp" onChange={(e) => choose(e.target.files?.[0])} />
        {drawing ? null : (
          <div className="acts" style={{ marginTop: 0 }}>
            <button className="btn" type="button" disabled={busy} onClick={() => input.current?.click()}>{busy ? t.picUploading : pic ? t.picChange : t.picChoose}</button>
            <button className="btn" type="button" disabled={busy} onClick={() => setDrawing(true)}>{pic ? t.drawOn : t.drawBtn}</button>
            {pic && !busy ? <button className="link" type="button" onClick={() => setPic(null)}>{t.picRemove}</button> : null}
          </div>
        )}
        {error ? <p className="err" role="alert">{error}</p> : null}
      </div>

      <div className="field">
        <label htmlFor="sModel">{t.modelLabel}</label>
        <span className="muted small">{t.modelHint}</span>
        {model ? <ModelView src={model.url} alt="" hint={t.modelRotate} loading={t.modelLoading} /> : null}
        <input ref={modelInput} className="filepick" type="file" tabIndex={-1} id="sModel" accept=".glb,model/gltf-binary" onChange={(e) => chooseModel(e.target.files?.[0])} />
        <div className="acts" style={{ marginTop: 0 }}>
          <button className="btn" type="button" disabled={modelBusy} onClick={() => modelInput.current?.click()}>{modelBusy ? t.picUploading : model ? t.modelChange : t.modelChoose}</button>
          {model && !modelBusy ? <button className="link" type="button" onClick={() => setModel(null)}>{t.modelRemove}</button> : null}
        </div>
        {modelError ? <p className="err" role="alert">{modelError}</p> : null}
      </div>

      <div><button className="btn primary" type="submit" disabled={busy || drawing || modelBusy}>{t.dsSubmit}</button></div>
    </form>
  );
}
