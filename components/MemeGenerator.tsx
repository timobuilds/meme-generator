"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { db } from "@/lib/instant";

interface TextState {
  text: string;
  fontSize: number;
  x: number;
  y: number;
  textColor: string;
  borderColor: string;
}

interface MemeState {
  top: TextState;
  bottom: TextState;
}

const SAMPLE_IMAGES = [
  "/samples/image.png",
  "/samples/image copy.png",
  "/samples/image copy 2.png",
];

export default function MemeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = db.useAuth();
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<"top" | "bottom" | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeSample, setActiveSample] = useState<number | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const [textState, setTextState] = useState<MemeState>({
    top: {
      text: "",
      fontSize: 48,
      x: 400,
      y: 50,
      textColor: "#ffffff",
      borderColor: "#000000",
    },
    bottom: {
      text: "",
      fontSize: 48,
      x: 400,
      y: 550,
      textColor: "#ffffff",
      borderColor: "#000000",
    },
  });

  const loadImage = useCallback((src: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setCurrentImage(img);
      const maxWidth = 800;
      const maxHeight = 600;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      setCanvasSize({ width, height });
      setTextState((prev) => ({
        top: { ...prev.top, x: width / 2, y: 50 },
        bottom: { ...prev.bottom, x: width / 2, y: height - 50 },
      }));
    };
    img.src = src;
  }, []);

  const drawText = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      fontSize: number,
      textColor: string,
      borderColor: string
    ) => {
      ctx.save();
      ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const fillColor = textColor || "#ffffff";
      const strokeColor = borderColor || "#000000";

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      ctx.strokeText(text, x, y);

      ctx.fillStyle = fillColor;
      ctx.fillText(text, x, y);
      ctx.restore();
    },
    []
  );

  const drawMeme = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

    if (textState.top.text && textState.top.text.trim() !== "") {
      drawText(
        ctx,
        textState.top.text,
        textState.top.x,
        textState.top.y,
        textState.top.fontSize,
        textState.top.textColor,
        textState.top.borderColor
      );
    }

    if (textState.bottom.text && textState.bottom.text.trim() !== "") {
      drawText(
        ctx,
        textState.bottom.text,
        textState.bottom.x,
        textState.bottom.y,
        textState.bottom.fontSize,
        textState.bottom.textColor,
        textState.bottom.borderColor
      );
    }

    ctx.restore();
  }, [currentImage, textState, drawText]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    drawMeme();
  }, [canvasSize, drawMeme]);

  const getTextAtPoint = useCallback(
    (x: number, y: number): "top" | "bottom" | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const canvasX = (x - rect.left) * scaleX;
      const canvasY = (y - rect.top) * scaleY;

      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      if (textState.top.text) {
        ctx.font = `bold ${textState.top.fontSize}px Impact, Arial Black, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const metrics = ctx.measureText(textState.top.text);
        const textWidth = metrics.width;
        const textHeight = textState.top.fontSize;

        if (
          canvasX >= textState.top.x - textWidth / 2 - 10 &&
          canvasX <= textState.top.x + textWidth / 2 + 10 &&
          canvasY >= textState.top.y - textHeight / 2 - 10 &&
          canvasY <= textState.top.y + textHeight / 2 + 10
        ) {
          return "top";
        }
      }

      if (textState.bottom.text) {
        ctx.font = `bold ${textState.bottom.fontSize}px Impact, Arial Black, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const metrics = ctx.measureText(textState.bottom.text);
        const textWidth = metrics.width;
        const textHeight = textState.bottom.fontSize;

        if (
          canvasX >= textState.bottom.x - textWidth / 2 - 10 &&
          canvasX <= textState.bottom.x + textWidth / 2 + 10 &&
          canvasY >= textState.bottom.y - textHeight / 2 - 10 &&
          canvasY <= textState.bottom.y + textHeight / 2 + 10
        ) {
          return "bottom";
        }
      }

      return null;
    },
    [textState]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!currentImage) return;

      const target = getTextAtPoint(e.clientX, e.clientY);
      if (target) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = (e.clientX - rect.left) * scaleX;
        const canvasY = (e.clientY - rect.top) * scaleY;

        const state = textState[target];
        setDragOffset({
          x: canvasX - state.x,
          y: canvasY - state.y,
        });
        setIsDragging(true);
        setDragTarget(target);
        canvas.style.cursor = "grabbing";
      }
    },
    [currentImage, getTextAtPoint, textState]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || !currentImage) return;

      if (isDragging && dragTarget) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = (e.clientX - rect.left) * scaleX;
        const canvasY = (e.clientY - rect.top) * scaleY;

        setTextState((prev) => {
          const newState = { ...prev };
          const state = newState[dragTarget];
          state.x = Math.max(0, Math.min(canvas.width, canvasX - dragOffset.x));
          state.y = Math.max(0, Math.min(canvas.height, canvasY - dragOffset.y));
          return newState;
        });
      } else {
        const target = getTextAtPoint(e.clientX, e.clientY);
        canvas.style.cursor = target ? "grab" : "crosshair";
      }
    },
    [currentImage, isDragging, dragTarget, dragOffset, getTextAtPoint]
  );

  const handleMouseUp = useCallback(() => {
    const canvas = canvasRef.current;
    if (isDragging && canvas) {
      setIsDragging(false);
      setDragTarget(null);
      canvas.style.cursor = "crosshair";
    }
  }, [isDragging]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!currentImage) return;
      e.preventDefault();

      const touch = e.touches[0];
      const target = getTextAtPoint(touch.clientX, touch.clientY);
      if (target) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = (touch.clientX - rect.left) * scaleX;
        const canvasY = (touch.clientY - rect.top) * scaleY;

        const state = textState[target];
        setDragOffset({
          x: canvasX - state.x,
          y: canvasY - state.y,
        });
        setIsDragging(true);
        setDragTarget(target);
      }
    },
    [currentImage, getTextAtPoint, textState]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!currentImage) return;
      e.preventDefault();

      if (isDragging && dragTarget) {
        const touch = e.touches[0];
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = (touch.clientX - rect.left) * scaleX;
        const canvasY = (touch.clientY - rect.top) * scaleY;

        setTextState((prev) => {
          const newState = { ...prev };
          const state = newState[dragTarget];
          state.x = Math.max(0, Math.min(canvas.width, canvasX - dragOffset.x));
          state.y = Math.max(0, Math.min(canvas.height, canvasY - dragOffset.y));
          return newState;
        });
      }
    },
    [currentImage, isDragging, dragTarget, dragOffset]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      if (isDragging) {
        setIsDragging(false);
        setDragTarget(null);
      }
    },
    [isDragging]
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          loadImage(event.target.result as string);
          setActiveSample(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSampleClick = (index: number, src: string) => {
    loadImage(src);
    setActiveSample(index);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentImage) {
      alert("Please select an image first!");
      return;
    }

    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = dataURL;
    link.click();
  };

  const handlePost = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentImage || !user) {
      alert("Please select an image and sign in to post!");
      return;
    }

    setIsPosting(true);
    setPostSuccess(false);

    try {
      const imageData = canvas.toDataURL("image/png");
      const id = crypto.randomUUID();
      const memeData = {
        id,
        userId: user.id,
        userName: user.email || user.id,
        imageData,
        topText: textState.top.text,
        bottomText: textState.bottom.text,
        textState: JSON.stringify({
          top: textState.top,
          bottom: textState.bottom,
        }),
        createdAt: Date.now(),
        upvoteUserIds: JSON.stringify([]),
      };

      await db.transact(db.tx.memes[id].update(memeData));
      setPostSuccess(true);
      setTimeout(() => setPostSuccess(false), 5000);
    } catch (error) {
      console.error("Failed to post meme:", error);
      alert(`Failed to post meme: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsPosting(false);
    }
  };

  const updateTextState = (position: "top" | "bottom", updates: Partial<TextState>) => {
    setTextState((prev) => ({
      ...prev,
      [position]: { ...prev[position], ...updates },
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-10 items-start">
      <div className="bg-white p-10 rounded-2xl shadow-lg sticky top-10 border border-black/5">
        <div className="mb-8">
          <label
            htmlFor="imageInput"
            className="bg-accent text-white px-6 py-3.5 rounded-full border-none font-normal text-base cursor-pointer transition-all inline-block text-center w-full hover:bg-accent-hover active:scale-[0.97]"
          >
            Upload Your Image
          </label>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        <div className="mb-8 pt-8 border-t border-black/6">
          <h3 className="text-xs font-semibold mb-4 text-[#6e6e73] uppercase tracking-wider">
            Or Choose a Sample
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {SAMPLE_IMAGES.map((src, index) => (
              <div
                key={index}
                onClick={() => handleSampleClick(index, src)}
                className={`relative w-full h-20 rounded-lg cursor-pointer transition-all border-2 ${
                  activeSample === index
                    ? "border-accent shadow-[0_0_0_4px_rgba(0,0,0,0.1)]"
                    : "border-transparent hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <NextImage
                  src={src}
                  alt={`Sample ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {(["top", "bottom"] as const).map((position) => (
            <div
              key={position}
              className="p-6 bg-[#fbfbfd] rounded-xl border border-black/6 hover:bg-[#f5f5f7] hover:border-black/8 transition-all"
            >
              <h3 className="text-xs font-semibold mb-4 text-[#6e6e73] uppercase tracking-wider">
                {position === "top" ? "Top" : "Bottom"} Text
              </h3>
              <input
                type="text"
                placeholder={`Enter ${position} text...`}
                value={textState[position].text}
                onChange={(e) => updateTextState(position, { text: e.target.value })}
                className="w-full px-4 py-3 border border-[#d2d2d7] rounded-[10px] text-base mb-4.5 transition-all font-inherit bg-white text-[#1d1d1f] focus:outline-none focus:border-accent focus:shadow-[0_0_0_4px_rgba(0,0,0,0.1)] placeholder:text-[#a1a1a6]"
              />

              {[
                { key: "textColor", label: "Text Color" },
                { key: "borderColor", label: "Border Color" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3 mb-3">
                  <label className="text-sm font-normal text-[#6e6e73] min-w-[90px]">
                    {label}:
                  </label>
                  <input
                    type="color"
                    value={textState[position][key as "textColor" | "borderColor"]}
                    onChange={(e) =>
                      updateTextState(position, {
                        [key]: e.target.value,
                      } as Partial<TextState>)
                    }
                    className="w-[52px] h-9 border border-black/10 rounded-lg cursor-pointer transition-all p-0 bg-white shadow-sm hover:shadow-md"
                  />
                </div>
              ))}

              {[
                { key: "fontSize", label: "Font Size", min: 20, max: 100 },
                { key: "x", label: "X Position", min: 0, max: canvasSize.width },
                { key: "y", label: "Y Position", min: 0, max: canvasSize.height },
              ].map(({ key, label, min, max }) => (
                <div key={key} className="flex items-center gap-3 mb-3">
                  <label className="text-sm font-normal text-[#6e6e73] min-w-[90px]">
                    {label}:
                  </label>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={textState[position][key as keyof TextState] as number}
                    onChange={(e) =>
                      updateTextState(position, {
                        [key]: parseInt(e.target.value),
                      } as Partial<TextState>)
                    }
                    className="flex-1 h-[3px] rounded-sm bg-[#e8e8ed] outline-none appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-[0.5px] [&::-webkit-slider-thumb]:border-black/4 [&::-webkit-slider-thumb]:shadow-[0_3px_8px_rgba(0,0,0,0.15),0_3px_1px_rgba(0,0,0,0.06)] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb:hover]:shadow-[0_3px_8px_rgba(0,0,0,0.2),0_3px_1px_rgba(0,0,0,0.1)] [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-[0.5px] [&::-moz-range-thumb]:border-black/4 [&::-moz-range-thumb]:shadow-[0_3px_8px_rgba(0,0,0,0.15),0_3px_1px_rgba(0,0,0,0.06)] [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb:hover]:shadow-[0_3px_8px_rgba(0,0,0,0.2),0_3px_1px_rgba(0,0,0,0.1)]"
                  />
                  <span className="text-sm font-normal text-[#6e6e73] min-w-[40px] text-right">
                    {Math.round(textState[position][key as keyof TextState] as number)}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <button
          onClick={handleDownload}
          className="mt-8 w-full bg-accent text-white px-6 py-3.5 rounded-full border-none font-normal text-base cursor-pointer transition-all hover:bg-accent-hover active:scale-[0.97]"
        >
          Download Meme
        </button>

        {user && (
          <>
            <button
              onClick={handlePost}
              disabled={!currentImage || isPosting}
              className="mt-4 w-full bg-[#1d1d1f] text-white px-6 py-3.5 rounded-full border-none font-normal text-base cursor-pointer transition-all hover:bg-[#2d2d2f] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPosting ? "Posting..." : "Post Meme"}
            </button>
            {postSuccess && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 mb-2">
                  Meme posted successfully!
                </p>
                <Link
                  href="/feed"
                  className="text-sm text-green-600 hover:text-green-800 underline"
                >
                  View in Feed →
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-white p-12 rounded-2xl shadow-lg flex justify-center items-center min-h-[700px] relative border border-black/5">
        {currentImage ? (
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto border border-black/10 rounded-xl cursor-crosshair block shadow-md hover:shadow-lg transition-all"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[#a1a1a6] text-base pointer-events-none">
            <div className="text-5xl mb-4 opacity-30">🖼️</div>
            <p>Select an image to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

