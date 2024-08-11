"use client";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { PlusIcon } from "lucide-react";
import { MinusIcon } from "lucide-react";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface Props {
  model: boolean;
  modelImages: string[];
  initialImage?: string;
  setModel: (model: boolean) => void;
}

const ImagesModel = ({ model, modelImages, setModel, initialImage }: Props) => {
  const [zoomIn, setZoomIn] = useState(0);
  const imgRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  const settings = {
    dots: false,
    speed: 1100,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: (
      <NextArrow
        setZoomIn={setZoomIn}
        setPosition={setPosition}
        onClick={() => {}}
      />
    ),
    prevArrow: (
      <PrevArrow
        setZoomIn={setZoomIn}
        setPosition={setPosition}
        onClick={() => {}}
      />
    ),
    draggable: false,
    initialSlide: modelImages.findIndex((image) => image === initialImage),
  };

  useEffect(() => {
    const handleWheel = (event: any) => {
      if (event.deltaY > 0) {
        setZoomIn(0);
        setPosition({ x: 0, y: 0 });
        setStartPosition({ x: 0, y: 0 });
      } else if (event.deltaY < 0) {
        setZoomIn((prevZoom) => (prevZoom === 0 ? 1 : 2));
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("wheel", handleWheel);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleMouseDown = (event: any) => {
    setDragging(true);
    setStartPosition({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  };

  const handleMouseMove = (event: any) => {
    if (dragging && zoomIn > 0) {
      setPosition({
        x: event.clientX - startPosition.x,
        y: event.clientY - startPosition.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        className="fixed !left-[0px] !top-[-12px] z-[1000] h-screen w-full bg-[#f6f6f6] opacity-100 dark:bg-card"
      >
        {modelImages.length > 0 ? (
          <div className="relative w-full">
            <div className="w-full pb-[10rem]">
              <Slider {...settings}>
                {modelImages.map((src, index) => (
                  <div
                    key={index}
                    className={`relative h-screen w-full cursor-move overflow-hidden`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    draggable
                  >
                    <motion.img
                      src={src}
                      alt={`Image not loaded`}
                      style={{
                        transform: `translate3d(${position.x}px, ${
                          position.y
                        }px, 0) translate(-50%, -50%) scale(${
                          zoomIn === 1
                            ? 1.5
                            : zoomIn === 2
                            ? 1.9
                            : zoomIn === 3
                            ? 1
                            : 1
                        })`,
                        maxWidth: "100%",
                        objectFit: "contain",
                        height: "100%",
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transitionDuration: "400ms",
                      }}
                    />
                  </div>
                ))}
              </Slider>
            </div>

            <div
              className="fixed !right-[10px] !top-5 flex h-[33px] w-[33px] cursor-pointer items-center justify-center rounded-full bg-white sm:!right-[18px] xl:top-8"
              onClick={() => setModel(false)}
            >
              <X className="text-black" size={20} />
            </div>

            <div className="fixed bottom-6 right-[15px] flex flex-col gap-4 sm:right-[19px]">
              <button
                onClick={() => {
                  if (zoomIn === 0) {
                    setZoomIn(1);
                  } else if (zoomIn === 1) {
                    setZoomIn(2);
                  }
                }}
                className="z-50 flex h-[33px] w-[33px] !cursor-pointer items-center justify-center rounded-full bg-white opacity-100"
              >
                <PlusIcon size={20} className="text-black" />
              </button>
              <button
                disabled={zoomIn === 0}
                onClick={() => {
                  setZoomIn(0);
                  setPosition({ x: 0, y: 0 });
                  setStartPosition({ x: 0, y: 0 });
                }}
                className={`flex ${
                  zoomIn === 0 && "opacity-45"
                } z-50 h-[33px] w-[33px] !cursor-pointer items-center justify-center rounded-full bg-[white] opacity-100`}
              >
                <MinusIcon size={20} className="text-black" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="mt-9 text-center">
              Sorry Product Gallery Image Not available.!
            </h1>
            <div
              className="fixed right-[4%] top-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[white] text-xl text-[#484848] md:h-10 md:w-10 xl:top-8"
              onClick={() => setModel(false)}
            >
              <X />
            </div>
          </>
        )}
      </motion.div>
    </>
  );
};

export default ImagesModel;

interface NextArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick: () => void;
  setZoomIn: (zoom: number) => void;
  setPosition: (position: { x: number; y: number }) => void;
}

function NextArrow(props: NextArrowProps) {
  const { className, style, onClick, setZoomIn, setPosition } = props;
  return (
    <div
      className={`${className} !right-[10px] sm:!right-[18px] !h-[33px] !w-[33px] `}
      style={{
        ...style,
        // right: 18,
        zIndex: 100000,
        opacity: "10000",
        // height: "40px",
        // width: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#00000014",
        borderRadius: "100%",
        cursor: "pointer",
      }}
      onClick={() => {
        onClick();
        setZoomIn(0);
        setPosition({ x: 0, y: 0 });
      }}
    >
      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-full bg-[white]">
        <ChevronRight className="text-black" />
      </div>
    </div>
  );
}

interface PrevArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick: () => void;
  setZoomIn: (zoom: number) => void;
  setPosition: (position: { x: number; y: number }) => void;
}

function PrevArrow(props: PrevArrowProps) {
  const { className, style, onClick, setZoomIn, setPosition } = props;
  return (
    <div
      className={`${className} !left-[10px] sm:!left-[18px] !h-[33px] !w-[33px] `}
      style={{
        ...style,
        // left: 25,
        zIndex: 100000,
        opacity: "10000",
        // height: "40px",
        // width: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#00000014",
        borderRadius: "100%",
        cursor: "pointer",
      }}
      onClick={() => {
        onClick();
        setZoomIn(0);
        setPosition({ x: 0, y: 0 });
      }}
    >
      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-full bg-[white]">
        <ChevronLeft className="text-black" />
      </div>
    </div>
  );
}
