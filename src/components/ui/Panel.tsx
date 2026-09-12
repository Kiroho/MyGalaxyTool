import type { ReactNode, MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useState } from "react";

type Props = {
    children: ReactNode;
    extension?: ReactNode;
    message?: string;
    messageType?: "success" | "error" | "info";
    onMessageClear?: () => void;
    title?: string;
    onClose?: () => void;
    onFocus?: () => void;
    width?: number;
    defaultHeight?: number;
    minHeight?: number;
    initialX?: number;
    initialY?: number;
    zIndex?: number;
};

type PanelSize = {
    width: number;
    height: number;
};

export default function Panel({
    children,
    extension,
    message,
    messageType = "info",
    onMessageClear,
    title,
    onClose,
    onFocus,
    width = 350,
    defaultHeight = 400,
    minHeight = 200,
    initialX = 30,
    initialY = 100,
    zIndex = 100
}: Props) {
    const storageKey =
        title
            ? `galaxy_panel_size_${title}`
            : null;

    const [position, setPosition] =
        useState({
            x: initialX,
            y: initialY
        });

    const [size, setSize] =
        useState<PanelSize>(() => {
            if(!storageKey){
                return {
                    width,
                    height: defaultHeight
                };
            }

            try{
                const stored =
                    localStorage.getItem(
                        storageKey
                    );

                if(!stored){
                    return {
                        width,
                        height: defaultHeight
                    };
                }

                const parsed =
                    JSON.parse(
                        stored
                    ) as Partial<PanelSize>;

                return {
                    width:
                        typeof parsed.width === "number"
                            ? Math.max(
                                width,
                                parsed.width
                            )
                            : width,
                    height:
                        typeof parsed.height === "number"
                            ? Math.max(
                                minHeight,
                                parsed.height
                            )
                            : defaultHeight
                };
            }
            catch{
                return {
                    width,
                    height: defaultHeight
                };
            }
        });

    const [dragging,setDragging] =
        useState(false);

    const [resizing,setResizing] =
        useState(false);

    const [dragOffset,setDragOffset] =
        useState({
            x: 0,
            y: 0
        });

    const [resizeStart,setResizeStart] =
        useState({
            mouseX: 0,
            mouseY: 0,
            width: size.width,
            height: size.height
        });

    const focusPanel = () => {
        if(onFocus){
            onFocus();
        }
    };

    useEffect(() => {
        if(!message){
            return;
        }

        const timer =
            window.setTimeout(() => {
                if(onMessageClear){
                    onMessageClear();
                }
            }, 4000);

        return () => {
            window.clearTimeout(timer);
        };
    }, [
        message,
        onMessageClear
    ]);    

    const startDrag = (
        event: ReactMouseEvent<HTMLDivElement>
    ) => {
        event.preventDefault();

        focusPanel();

        setDragging(true);

        setDragOffset({
            x:
                event.clientX -
                position.x,
            y:
                event.clientY -
                position.y
        });
    };

    const startResize = (
        event: ReactMouseEvent<HTMLDivElement>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        focusPanel();

        setResizing(true);

        setResizeStart({
            mouseX: event.clientX,
            mouseY: event.clientY,
            width: size.width,
            height: size.height
        });
    };

    useEffect(() => {
        if(!dragging && !resizing){
            return;
        }

        const handleMouseMove = (
            event: MouseEvent
        ) => {
            if(dragging){
                setPosition({
                    x:
                        event.clientX -
                        dragOffset.x,
                    y:
                        event.clientY -
                        dragOffset.y
                });
            }

            if(resizing){
                const newWidth =
                    Math.max(
                        width,
                        resizeStart.width +
                        event.clientX -
                        resizeStart.mouseX
                    );

                const newHeight =
                    Math.max(
                        minHeight,
                        resizeStart.height +
                        event.clientY -
                        resizeStart.mouseY
                    );

                setSize({
                    width: newWidth,
                    height: newHeight
                });
            }
        };

        const handleMouseUp = () => {
            setDragging(false);
            setResizing(false);
        };

        window.addEventListener(
            "mousemove",
            handleMouseMove
        );

        window.addEventListener(
            "mouseup",
            handleMouseUp
        );

        return () => {
            window.removeEventListener(
                "mousemove",
                handleMouseMove
            );

            window.removeEventListener(
                "mouseup",
                handleMouseUp
            );
        };
    }, [
        dragging,
        resizing,
        dragOffset,
        resizeStart,
        width,
        minHeight
    ]);

    useEffect(() => {
        if(!storageKey || !resizing){
            return;
        }

        localStorage.setItem(
            storageKey,
            JSON.stringify(size)
        );
    }, [
        size,
        storageKey,
        resizing
    ]);

    const messageBackground =
        messageType === "success"
            ? "#164d2a"
            : messageType === "error"
                ? "#5a2020"
                : "#18365c";

    const messageColor =
        messageType === "success"
            ? "#9cffb5"
            : messageType === "error"
                ? "#ffaaaa"
                : "#a8cfff";

    return (
        <div
            style={{
                position: "fixed",
                left: position.x,
                top: position.y,
                width: size.width,
                height: size.height,
                zIndex
            }}
        >
            <div
                onMouseDown={focusPanel}
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    background: "#102544",
                    color: "white",
                    minWidth: width,
                    minHeight,
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.5)",
                    boxSizing: "border-box",
                    userSelect:
                        dragging || resizing
                            ? "none"
                            : "auto"
                }}
            >
                {
                    title &&
                    <div
                        onMouseDown={startDrag}
                        style={{
                            height: "50px",
                            marginTop: "-20px",
                            marginLeft: "-20px",
                            marginRight: "-20px",
                            marginBottom: "10px",
                            paddingLeft: "20px",
                            paddingRight: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "move",
                            fontWeight: "bold",
                            fontSize: "20px",
                            borderBottom:
                                "1px solid #ffffff22"
                        }}
                    >
                        <span>
                            {title}
                        </span>

                        {
                            onClose &&
                            <button
                                onMouseDown={(event) => {
                                    event.stopPropagation();
                                }}
                                onClick={onClose}
                                style={{
                                    cursor: "pointer",
                                    background: "transparent",
                                    border: "none",
                                    color: "white",
                                    fontSize: "20px"
                                }}
                            >
                                ✕
                            </button>
                        }
                    </div>
                }

                <div
                    style={{
                        height: "calc(100% - 40px)",
                        overflow: "auto"
                    }}
                >
                    {children}
                </div>

                <div
                    onMouseDown={startResize}
                    style={{
                        position: "absolute",
                        right: "3px",
                        bottom: "3px",
                        width: "16px",
                        height: "16px",
                        cursor: "nwse-resize"
                    }}
                />
            </div>

            {
                message &&
                <div
                    onMouseDown={focusPanel}
                    style={{
                        position: "absolute",
                        top: "calc(100% + 10px)",
                        left: 0,
                        width: "100%",
                        background: messageBackground,
                        color: messageColor,
                        padding: "10px 15px",
                        borderRadius: "8px",
                        boxShadow:
                            "0 10px 30px rgba(0,0,0,0.5)",
                        boxSizing: "border-box",
                        fontSize: "13px"
                    }}
                >
                    {message}
                </div>
            }

            {
                extension &&
                <div
                    onMouseDown={focusPanel}
                    style={{
                        position: "absolute",
                        top:
                            message
                                ? "calc(100% + 55px)"
                                : "calc(100% + 10px)",
                        left: 0,
                        width: "100%",
                        background: "#102544",
                        color: "white",
                        padding: "20px",
                        borderRadius: "10px",
                        boxShadow:
                            "0 10px 30px rgba(0,0,0,0.5)",
                        boxSizing: "border-box"
                    }}
                >
                    {extension}
                </div>
            }
        </div>
    );
}