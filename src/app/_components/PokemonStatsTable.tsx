import type { NormalizedStats } from "@/server/schemas/getAllInfinite.output";
import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import React, { useState } from "react";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
  stats: NormalizedStats;
}

export const PokemonStatsTable: React.FC<Props> = ({ stats }) => {
  const [tab, setTab] = useState<"tabla" | "grafico">("tabla");
  const values = Object.values(stats.values) as number[];
  const maxStat = Math.max(...values);
  const radarMax = maxStat + 20;
  const radarLabels = ["HP", "ATK", "DEF", "SPA", "SPD", "SPE"];
  const data = {
    labels: radarLabels,
    datasets: [
      {
        label: "Estadísticas base",
        data: values,
        backgroundColor: "rgba(234, 179, 8, 0.2)",
        borderColor: "#eab308",
        pointBackgroundColor: "#eab308",
        pointBorderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };
  const options = {
    scales: {
      r: {
        angleLines: { color: "#bbb", lineWidth: 1 }, // radiales, sutiles
        grid: { color: "#2a3550", lineWidth: 2 }, // concéntricas, azul oscuro
        pointLabels: { color: "#fff", font: { size: 14 } },
        ticks: {
          display: false,
        },
        min: 0,
        max: radarMax,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 0, marginBottom: 0, justifyContent: "flex-start" }}>
        <button
          onClick={() => setTab("tabla")}
          style={{
            padding: "6px 16px",
            borderRadius: "8px 8px 0 0",
            border: "none",
            background: tab === "tabla" ? "#eab308" : "#23214a",
            color: tab === "tabla" ? "#23214a" : "#fff",
            fontWeight: tab === "tabla" ? "bold" : "normal",
            cursor: "pointer",
            outline: "none",
            borderBottom: tab === "tabla" ? "2px solid #eab308" : "2px solid #23214a",
          }}
        >
          Tabla
        </button>
        <button
          onClick={() => setTab("grafico")}
          style={{
            padding: "6px 16px",
            borderRadius: "8px 8px 0 0",
            border: "none",
            background: tab === "grafico" ? "#eab308" : "#23214a",
            color: tab === "grafico" ? "#23214a" : "#fff",
            fontWeight: tab === "grafico" ? "bold" : "normal",
            cursor: "pointer",
            outline: "none",
            borderBottom: tab === "grafico" ? "2px solid #eab308" : "2px solid #23214a",
          }}
        >
          Gráfico
        </button>
      </div>
      <div
        style={{
          border: "2px solid #eab308",
          borderRadius: tab === "tabla" ? "0 12px 12px 12px" : "12px",
          background: "#18173a",
          padding: 24,
          maxWidth: 400,
          marginTop: 0,
          marginLeft: 0,
        }}
      >
        {tab === "tabla" ? (
          <table style={{ width: "100%", marginTop: 4, background: "#18173a", borderRadius: 8, maxWidth: 220 }}>
            <tbody>
              {Object.entries(stats.labels).map(([key, label]) => (
                <tr key={key}>
                  <td style={{ color: "#fff", padding: "4px 8px", textAlign: "right" }}>{(() => {
                    const parts = String(label).split("/").map(s => s.trim()).filter(Boolean);
                    return parts.slice(-2).join("/");
                  })()}</td>
                  <td style={{ color: "#eab308", fontWeight: "bold", padding: "4px 8px", textAlign: "right" }}>{stats.values[key as keyof typeof stats.values]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ width: 320, height: 320, minWidth: 220, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
              <Radar
                data={data}
                options={options}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
