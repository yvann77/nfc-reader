import React, { useState, useEffect } from 'react';

function App() {
  const [nfcSupported, setNfcSupported] = useState(false);
  const [jwt, setJwt] = useState('');

  useEffect(() => {
    if ('NDEFReader' in window) {
      setNfcSupported(true);
    }
  }, []);

  const readNfc = async () => {
    if (!nfcSupported) {
      alert("NFC n'est pas supporté sur cet appareil");
      return;
    }

    try {
      const ndef = new window.NDEFReader();
      await ndef.scan();
      
      ndef.addEventListener("reading", ({ message }) => {
        for (const record of message.records) {
          if (record.recordType === "text") {
            const textDecoder = new TextDecoder();
            const jwtString = textDecoder.decode(record.data);
            setJwt(jwtString);
          }
        }
      });
    } catch (error) {
      console.error("Erreur lors de la lecture NFC:", error);
      alert("Erreur lors de la lecture NFC. Assurez-vous que NFC est activé.");
    }
  };

  return (
    <div className="App">
      <h1>Lecteur NFC JWT</h1>
      <button onClick={readNfc}>Lire NFC</button>
      {jwt && (
        <div>
          <h2>JWT lu :</h2>
          <pre>{jwt}</pre>
        </div>
      )}
    </div>
  );
}

export default App;