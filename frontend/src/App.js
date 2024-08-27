import { useState, useEffect } from "react";
import Cursor from "./Cursor";

const cursorColors = ["red", "blue", "green", "purple"];

const getRandomColor = (hash) => {
  return cursorColors[hash.charCodeAt(hash.length - 1) % cursorColors.length];
};
function App() {
  const [cursors, setCursors] = useState([]);
  const [uuid, setUuid] = useState(null);

  useEffect(() => {
    const conn = new WebSocket(
      "wss://salty-maddy-testing-doshy-org-2dfc446e.koyeb.app/ws"
    );
    conn.onmessage = function (evt) {
      const parse = JSON.parse(evt.data);
      if (parse.Action === "subscribe") {
        setUuid(parse.Msg);
        console.log("subscribe", uuid);
        return;
      }
      if (parse.Action === "tick") {
        setCursors(parse.Body);
      }
    };

    document.addEventListener("mousemove", (e) => {
      console.log(e.pageX, e.pageY);
      conn.send(
        JSON.stringify({
          Action: "move",
          RoomID: "test",
          MouseX: e.pageX,
          MouseY: e.pageY,
        })
      );
    });
  }, []);

  if (!uuid) {
    return <div>Connecting...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        {cursors.map((cursor) => (
          <Cursor
            key={cursor.UserID}
            color={getRandomColor(cursor.UserID)}
            x={cursor.MouseX}
            y={cursor.MouseY}
          />
        ))}
      </header>
    </div>
  );
}

export default App;
