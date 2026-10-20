import { useEffect, useRef, useState, type KeyboardEvent } from "react";

export type ResearchFigureSource = { title: string; src: string; alt: string; fallbackSrc?: string };

export default function ResearchFigureViewer({ figure, onClose }: { figure: ResearchFigureSource; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState(figure.src);
  const [failed, setFailed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = dialog.current;
    const viewport = stage.current;
    if (!element || !viewport) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    closeButton.current?.focus({ preventScroll: true });
    const measure = () => setStageSize({ width: viewport.clientWidth, height: viewport.clientHeight });
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    measure();
    return () => {
      observer.disconnect();
      element.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const element = image.current;
    if (element?.complete && element.naturalWidth > 0) {
      setImageSize({ width: element.naturalWidth, height: element.naturalHeight });
    }
  }, [imageSrc]);

  useEffect(() => {
    const viewport = stage.current;
    if (!viewport) return;
    viewport.scrollLeft = Math.max(0, (viewport.scrollWidth - viewport.clientWidth) / 2);
    viewport.scrollTop = Math.max(0, (viewport.scrollHeight - viewport.clientHeight) / 2);
  }, [zoom]);

  const ready = imageSize.width > 0 && stageSize.width > 0 && stageSize.height > 0;
  const fitScale = ready ? Math.min(1, (stageSize.width - 32) / imageSize.width, (stageSize.height - 32) / imageSize.height) : 1;
  const imageWidth = Math.max(1, imageSize.width * fitScale * zoom);
  const imageHeight = Math.max(1, imageSize.height * fitScale * zoom);
  const changeZoom = (amount: number) => setZoom((current) => Math.min(5, Math.max(1, current + amount)));

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Tab") {
      const controls = Array.from(dialog.current?.querySelectorAll<HTMLElement>("button:not(:disabled), a[href], [tabindex='0']") ?? []);
      if (!controls.length) return;
      const current = controls.indexOf(document.activeElement as HTMLElement);
      const next = current < 0 ? (event.shiftKey ? controls.length - 1 : 0) : (current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
      event.preventDefault();
      controls[next].focus();
    } else if (ready && !event.ctrlKey && !event.metaKey && !event.altKey && ["+", "=", "-", "0"].includes(event.key)) {
      event.preventDefault();
      if (event.key === "0") setZoom(1);
      else changeZoom(event.key === "-" ? -.5 : .5);
    }
  };

  return (
    <dialog ref={dialog} className="figure-viewer" aria-labelledby="figure-viewer-title" onKeyDown={handleKeyDown}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <header className="figure-viewer-header">
        <h2 id="figure-viewer-title">{figure.title}</h2>
        <button ref={closeButton} className="figure-viewer-close" type="button" onClick={onClose} aria-label="Close figure">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
        </button>
      </header>
      <div className="figure-viewer-toolbar" role="group" aria-label="Figure controls">
        <button type="button" onClick={() => changeZoom(-.5)} disabled={!ready || zoom === 1} aria-label="Zoom out">−</button>
        <output aria-live="polite" aria-label="Zoom level">{Math.round(zoom * 100)}%</output>
        <button type="button" onClick={() => changeZoom(.5)} disabled={!ready || zoom === 5} aria-label="Zoom in">+</button>
        <button type="button" className="figure-viewer-fit" onClick={() => setZoom(1)} disabled={!ready} aria-label="Fit figure to window">Fit</button>
        <a href={imageSrc} target="_blank" rel="noreferrer">Open full-size</a>
        <span className="figure-viewer-hint">Zoom to inspect; scroll to move.</span>
      </div>
      <div ref={stage} className="figure-viewer-stage" tabIndex={0} role="region" aria-label="Enlarged figure; use arrow keys to scroll when zoomed">
        {(!ready || failed) && <p className="figure-viewer-message" role="status">{failed ? "The image could not be loaded. Please close the viewer and try again." : "Loading figure…"}</p>}
        <div className="figure-viewer-canvas" style={{ width: Math.max(stageSize.width, imageWidth + 32), height: Math.max(stageSize.height, imageHeight + 32) }}>
          <img ref={image} src={imageSrc} alt={figure.alt} draggable={false} decoding="async"
            onLoad={(event) => setImageSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })}
            onError={() => {
              if (figure.fallbackSrc && imageSrc !== figure.fallbackSrc) {
                setImageSize({ width: 0, height: 0 });
                setImageSrc(figure.fallbackSrc);
              } else setFailed(true);
            }}
            onDoubleClick={() => setZoom((current) => current === 1 ? 2 : 1)}
            style={{ width: imageWidth, height: imageHeight, opacity: ready ? 1 : 0, cursor: zoom === 1 ? "zoom-in" : "zoom-out" }} />
        </div>
      </div>
    </dialog>
  );
}
