let valueGraph = []
let data = null
let options = null
let chart = null
function Prediction() {
    let file = document.getElementById('file').files[0];
    if (file == undefined) {
        alert("Debe ingresar un archivo")
        return
    }
    let p = prompt("Ingrese 'x' si desea prediccion en x o 'y' si desea prediccion en y")
    let reader = new FileReader()
    let x = []
    let y = []
    let contenido;
    reader.onload = function (e) {
        contenido = e.target.result.trim()
        let nuevo = contenido.split("\n")
        for (let i = 1; i < nuevo.length; i++) {
            let n = nuevo[i].split(',')
            x.push(parseInt(n[0]))
            y.push(parseInt(n[1]))
        }
        var linear = new LinearRegression()
        linear.fit(x, y)
        if (p == "x") {
            yPredict = linear.predict(x)
            document.getElementById("log").innerHTML += '<br>Datos en  X:   ' + x + '<br>Datos en Y:   ' + y + '<br>Y Predict: ' + yPredict
            valueGraph = joinArrays('x', x, 'y', y, 'PrediccionY', yPredict)
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(Graph);
        } else {
            xPredict = linear.predict(y);
            document.getElementById("log").innerHTML += '<br>Datos en  X:   ' + x + '<br>Datos en Y:   ' + y + '<br>X Predict: ' + xPredict
            valueGraph = joinArrays('x', x, 'y', y, 'PrediccionX', xPredict)
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(Graph);
        }
    }
    reader.readAsText(file)
}



function Graph() {

    data = google.visualization.arrayToDataTable(valueGraph);
    options = {
        seriesType: 'scatter',
        series: { 1: { type: 'line' } }
    };
    chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
}

function Gr() {
    if (chart == null) {
        alert("No hay datos que mostrar")
        return
    }

    chart.draw(data, options);
}

function Polinom() {
    let file = document.getElementById('file').files[0];
    if (file == undefined) {
        alert("Debe ingresar un archivo")
        return
    }
    let reader = new FileReader()
    let xp = []
    let yp = []
    let contenido;
    let table = document.getElementById('table');
    reader.onload = function (e) {
        contenido = e.target.result.trim()
        let nuevo = contenido.split("\n")
        for (let i = 1; i < nuevo.length; i++) {
            let n = nuevo[i].split(',')
            xp.push(parseInt(n[0]))
            yp.push(parseInt(n[1]))
        }
        let polynomialRegression = new PolynomialRegression();
        polynomialRegression.fit(xp, yp, 2);
        let grade2 = polynomialRegression.predict(xp);
        polynomialRegression.fit(xp, yp, 3);
        let grade3 = polynomialRegression.predict(xp);
        polynomialRegression.fit(xp, yp, 4);
        let grade4 = polynomialRegression.predict(xp);
        table.innerHTML += `
            <tr>
				<th>Indice</th>
				<th>Valor X</th>
                <th>Valor Y</th>
                <th>Grado 2</th>
                <th>Grado 3</th>
                <th>Grado 4</th>
			</tr>
        `
        for (let i = 0; i < xp.length; i++) {
            table.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${xp[i]}</td>
                <td>${yp[i]}</td>
                <td>${grade2[i]}</td>
                <td>${grade3[i]}</td>
                <td>${grade4[i]}</td>
            </tr>
            `
        }

        valueGraph.push(["X", "Y", "Grado 2", "Grado 3", "Grado 4"]);
        for (let i = 0; i < xp.length; i++) {
            const x = xp[i];
            valueGraph.push([
                x.toString(),
                yp[i],
                grade2[i],
                grade3[i],
                grade4[i],
            ]);
        }
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(GraphPolinom);

    }
    reader.readAsText(file)
}

function GraphPolinom() {
    data = google.visualization.arrayToDataTable(valueGraph);

    options = {
        title: "Regresion polinomial",
        legend: { position: "bottom" },
    };

    chart = new google.visualization.LineChart(
        document.getElementById("chart_div")
    );
}

function Cambio(e){
    if(e.target.value=="mod1"){
        Prediction()
    }else if(e.target.value=="mod2"){
        Polinom()
    }
}