
import { useState, useEffect } from "react";
import axios from "axios";

export const App = () => {
    const [dartsozok, setDartsozok] = useState([]);
    const [kivalasztott, setKivalasztott] = useState(null);
    const [modositandoId, setModositandoId] = useState(null);

    const [nev, setNev] = useState("");
    const [szuletesiDatum, setSzuletesiDatum] = useState("");
    const [vbGyozelmek, setVbGyozelmek] = useState(0);
    const [profilUrl, setProfilUrl] = useState("");
    const [kepUrl, setKepUrl] = useState("");

    const adatokBetoltese = () => {
        axios.get("https://darts.sulla.hu/darts")
            .then((valasz) => {
                setDartsozok(valasz.data);
            })
            .catch((hiba) => {
                console.log("Hiba:", hiba);
            });
    };

    useEffect(() => {
        adatokBetoltese();
    }, []);

    const kuldes = (event) => {
        event.preventDefault();

        const ujAdat = {
            name: nev,
            birth_date: szuletesiDatum,
            world_ch_won: vbGyozelmek,
            profile_url: profilUrl,
            image_url: kepUrl
        };

        if (modositandoId === null) {
            axios.post("https://darts.sulla.hu/darts", ujAdat)
                .then(() => {
                    alert("Sikeres felvitel!");
                    urlapTorlese();
                    adatokBetoltese();
                })
                .catch((hiba) => {
                    console.log("Hiba:", hiba);
                });
        } else {
            axios.put("https://darts.sulla.hu/darts/" + modositandoId, ujAdat)
                .then(() => {
                    alert("Sikeres módosítás!");
                    urlapTorlese();
                    adatokBetoltese();
                })
                .catch((hiba) => {
                    console.log("Hiba:", hiba);
                });
        }
    };

    const urlapTorlese = () => {
        setNev("");
        setSzuletesiDatum("");
        setVbGyozelmek(0);
        setProfilUrl("");
        setKepUrl("");
        setModositandoId(null);
    };

    const reszletek = (id) => {
        axios.get("https://darts.sulla.hu/darts/" + id)
            .then((valasz) => {
                setKivalasztott(valasz.data);
            })
            .catch((hiba) => {
                console.log("Hiba:", hiba);
            });
    };

    const modositas = (dartsozo) => {
        setModositandoId(dartsozo.id);
        setNev(dartsozo.name);
        setSzuletesiDatum(dartsozo.birth_date);
        setVbGyozelmek(dartsozo.world_ch_won);
        setProfilUrl(dartsozo.profile_url);
        setKepUrl(dartsozo.image_url);
    };

    const torlesTeszt = () => {
        const tesztAdat = {
            name: "Teszt dartsozó",
            birth_date: "2000-01-01",
            world_ch_won: 0,
            profile_url: "https://example.com",
            image_url: "https://placeholder.co/400x800"
        };

        axios.post("https://darts.sulla.hu/darts", tesztAdat)
            .then((valasz) => {
                const ujId = valasz.data.id;

                if (ujId) {
                    return axios.delete("https://darts.sulla.hu/darts/" + ujId);
                } else {
                    alert("A létrehozás sikerült, de nem kaptunk vissza azonosítót.");
                }
            })
            .then(() => {
                alert("A tesztbejegyzést sikeresen töröltük!");
                adatokBetoltese();
            })
            .catch((hiba) => {
                console.log("Hiba:", hiba);
            });
    };

    return (
        <div className="container p-4">

            <h1 className="text-center mb-4">Dartsozók</h1>

            <div className="row">

                {dartsozok.map((dartsozo) => (
                    <div className="col-sm-4 mb-3" key={dartsozo.id}>
                        <div className="card p-2">

                            <img
                                src={dartsozo.image_url}
                                alt={dartsozo.name}
                                className="img-fluid"
                                style={{ height: "200px", objectFit: "contain" }}
                            />

                            <div className="card-body text-center">
                                <h5>{dartsozo.name}</h5>

                                <p>Születési dátum: {dartsozo.birth_date}</p>
                                <p>Világbajnoki címek: {dartsozo.world_ch_won}</p>

                                <a href={dartsozo.profile_url} target="_blank">
                                    Profil
                                </a>

                                <br /><br />

                                <button
                                    className="btn btn-primary m-1"
                                    onClick={() => reszletek(dartsozo.id)}
                                >
                                    Részletek
                                </button>

                                <button
                                    className="btn btn-warning m-1"
                                    onClick={() => modositas(dartsozo)}
                                >
                                    Módosítás
                                </button>

                            </div>
                        </div>
                    </div>
                ))}

            </div>

            <hr />

            <h2>
                {modositandoId === null
                    ? "Új dartsozó felvétele"
                    : "Dartsozó módosítása"}
            </h2>

            <form onSubmit={kuldes}>

                <div className="mb-2">
                    <label>Név:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nev}
                        onChange={(e) => setNev(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-2">
                    <label>Születési dátum:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={szuletesiDatum}
                        onChange={(e) => setSzuletesiDatum(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-2">
                    <label>Világbajnoki címek száma:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={vbGyozelmek}
                        onChange={(e) => setVbGyozelmek(e.target.value)}
                    />
                </div>

                <div className="mb-2">
                    <label>Profil URL:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={profilUrl}
                        onChange={(e) => setProfilUrl(e.target.value)}
                    />
                </div>

                <div className="mb-2">
                    <label>Kép URL:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={kepUrl}
                        onChange={(e) => setKepUrl(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-success m-1">
                    {modositandoId === null ? "Felvitel" : "Módosítás"}
                </button>

                <button
                    type="button"
                    className="btn btn-secondary m-1"
                    onClick={urlapTorlese}
                >
                    Űrlap törlése
                </button>

            </form>

            <hr />

            <h2>Törlés tesztelése</h2>

            <p>
                A gomb először létrehoz egy teszt dartsozót,
                majd törli ugyanazt a bejegyzést.
            </p>

            <button className="btn btn-danger" onClick={torlesTeszt}>
                Létrehozás és törlés
            </button>

            {kivalasztott !== null && (
                <div className="card p-3 mt-4">
                    <h3>Kiválasztott dartsozó</h3>
                    <p>Név: {kivalasztott.name}</p>
                    <p>Születési dátum: {kivalasztott.birth_date}</p>
                    <p>Világbajnoki címek: {kivalasztott.world_ch_won}</p>

                    <button
                        className="btn btn-secondary"
                        onClick={() => setKivalasztott(null)}
                    >
                        Bezárás
                    </button>
                </div>
            )}

        </div>
    );
};

export default App;
