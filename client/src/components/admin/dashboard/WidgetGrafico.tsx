import React, { useEffect, useState } from "react";
import ApexChart from 'react-apexcharts';

const GraficoPrecos = ({ valores }: any) => {
    const [dataValue, setDataValue] = useState([]);

    useEffect(() => {
        let currentUltimoValor = 0;

        const newDataValue = valores.map((item: any, index: any) => {
            let newY;

            if (item.tipo === "Receita") {
                if (index === 0) {
                    newY = parseFloat(item.valor.toFixed(2));
                } else {
                    newY = parseFloat((currentUltimoValor + item.valor).toFixed(2));
                }
            } else {
                if (index === 0) {
                    newY = parseFloat(item.valor.toFixed(2));
                } else {
                    newY = parseFloat((currentUltimoValor - item.valor).toFixed(2));
                }
            }

            currentUltimoValor = newY;

            const adjustedTime = new Date(item.created_at).getTime() - 3 * 60 * 60 * 1000;

            return { x: adjustedTime, y: newY };
        });

        setDataValue(newDataValue);
    }, [valores]);

    const options: any = {
        xaxis: {
            type: "datetime",
        },
        yaxis: {
            tooltip: {
                enabled: true
            }
        },
        stroke: {
            width: 2
        },
        colors: ['#be0a45', '#be0a45', '#be0a45'],
        fill: {
            colors: ['#be0a45', '#be0a23', '#be0a45']
        },
        dataLabels: {
            style: {
                colors: ['#be0a45', '#be0a45', '#be0a45']
            }
        }
    };

    const series = [
        {
            name: "Saldo (R$)",
            data: dataValue
        }
    ];

    return (
        <div className="graphic-Component">
            <ApexChart
                options={options}
                series={series}
                type="area"
                width={"100%"}
                height={400}
            />
        </div>
    );
};

export default GraficoPrecos;
