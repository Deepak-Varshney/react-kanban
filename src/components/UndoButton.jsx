import React, { useEffect, useState } from "react";
import "../index.css";

const UndoButton = ({ onUndo, duration }) => {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [timeLeft]);

    const ringStyle = {
        background: `conic-gradient(#4caf50 ${timeLeft * (360 / duration)}deg, #ddd 0deg)`,
    };

    return (
        <div className="undo">
            <div className="ring" style={ringStyle}></div>
            <button onClick={onUndo}>Undo</button>
        </div>
    );
};

export default UndoButton;
