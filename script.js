const M_SAE1020 = [[0, 0.000],
[10, 0.003],
[25, 0.007],
[50, 0.015],
[75, 0.026],
[108, 0.050],
[137, 0.100],
[160, 0.150],
[180, 0.200],
[200, 0.250],
[235, 0.350],
[285, 0.500],
[320, 0.600],
[365, 0.700],
[480, 0.900],
[560, 1.000],
[660, 1.100],
[800, 1.200],
[1000, 1.300],
[1150, 1.354],
[1550, 1.450],
[1840, 1.500],
[2250, 1.550],
[2800, 1.600],
[3450, 1.650],
[4350, 1.700],
[5500, 1.750],
[7707, 1.810],
[11863, 1.890],
[15839, 1.945],
[21076, 2.000],
[27281, 2.050],
[35288, 2.100],
[45642, 2.150],
[59046, 2.200],
[76412, 2.250],
[98907, 2.300],
[128000, 2.350],
[134764, 2.360],
[141880, 2.370],
[149364, 2.380],
[157235, 2.390]
]
const Hiperco_50 = [[0, 0.000],
[10, 0.049],
[15, 0.072],
[29, 0.142],
[43, 0.207],
[55, 0.265],
[75, 0.357],
[101, 0.472],
[132, 0.605],
[181, 0.810],
[246, 1.061],
[314, 1.298],
[344, 1.392],
[394, 1.524],
[442, 1.620],
[503, 1.720],
[643, 1.868],
[787, 1.944],
[923, 1.986],
[1006, 2.005],
[1107, 2.022],
[1378, 2.054],
[1763, 2.086],
[1989, 2.100],
[2474, 2.122],
[2998, 2.140],
[4322, 2.170],
[5341, 2.184],
[7549, 2.207],
[10669, 2.233],
[14977, 2.256],
[20003, 2.275],
[28352, 2.295],
[38978, 2.313],
[49251, 2.326]
]

const M_35ZH135 = [
    [0, 0.000],
    [1, 0.010],
    [2, 0.020],
    [2, 0.035],
    [3, 0.066],
    [4, 0.099],
    [5, 0.148],
    [7, 0.203],
    [8, 0.263],
    [9, 0.324],
    [10, 0.485],
    [11, 0.540],
    [11, 0.589],
    [12, 0.643],
    [12, 0.682],
    [13, 0.784],
    [15, 0.951],
    [15, 1.002],
    [16, 1.062],
    [17, 1.164],
    [18, 1.220],
    [19, 1.271],
    [21, 1.316],
    [22, 1.370],
    [25, 1.427],
    [27, 1.460],
    [30, 1.509],
    [34, 1.552],
    [41, 1.608],
    [66, 1.706],
    [93, 1.754],
    [154, 1.803],
    [267, 1.842],
    [499, 1.886],
    [952, 1.925],
    [1944, 1.965],
    [4446, 1.999],
    [9721, 2.008]]

const A = 0.0008;
const l = 0.35;
const varT = 0.1;
const Ne = 400

let t = 0;
let fi = (t) => { return 0.00145892031 * Math.sin(120 * Math.PI * t) };
let B = (f) => { return f / A };
let I = (h) => { return h * l / Ne };

let dominio = [];
let amostrasI = []
let amostrasI2 = []
let amostrasI3 = []

for (let i = 0; i < 1000; i++) {
    let flag;
    flag = 1;
    t = varT * i / 1000.0;
    dominio.push(t);
    valueFi = fi(t);
    let b = B(valueFi)
    if (b < 0) {
        flag = -1
        b *= flag;
    }
    //amostrasB.push(b(valueFi));
    let H;
    let arr = M_35ZH135;
    let arr2 = M_SAE1020;
    let arr3 = Hiperco_50;
    H = getH(arr, b);
    amostrasI.push(flag * I(H));
    H = getH(arr2, b);
    amostrasI2.push(flag * I(H));
    H = getH(arr3, b)
    amostrasI3.push(flag * I(H))
}
function getH(arr, b) {
    for (j = 0; j < arr.length; j++) {
        //se b estiver entre os 2 pontos de b da curva bh listada abaixo, é feita uma eq da reta
        //pra determinar um valor aproximado de h
        //lembrando que o valor de b na lista abaixo está na segunda posição do array
        if (b < arr[j + 1][1]) {
            return interpolacao(arr[j], arr[j + 1], b);
        }
    }
}
google.charts.load('current', { 'packages': ['line'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = new google.visualization.DataTable(), data2 = new google.visualization.DataTable(), data3 = new google.visualization.DataTable();
    data.addColumn('number', 't');
    data.addColumn('number', 'I');
    data2.addColumn('number', 't');
    data2.addColumn('number', 'I');
    data3.addColumn('number', 't');
    data3.addColumn('number', 'I');
    let arr = [], arr2 = [], arr3 = []

    dominio.forEach((value, index) => {
        arr.push([value, amostrasI[index]]);
        arr2.push([value, amostrasI2[index]]);
        arr3.push([value, amostrasI3[index]]);
    }); 

    data.addRows(arr);
    data2.addRows(arr2);
    data3.addRows(arr3);

    var options = {
        chart: {
            title: 'M_35ZH135',
        }
    };
    var options2 = {
        chart: {
            title: 'M_SAE1020',
        }
    };
    var options3 = {
        chart: {
            title: 'Hiperco_50',
        }
    };

    var chart = new google.charts.Line(document.getElementById('curve_chart'));
    var chart2 = new google.charts.Line(document.getElementById('curve_chart2'));
    var chart3 = new google.charts.Line(document.getElementById('curve_chart3'));
    chart.draw(data, google.charts.Line.convertOptions(options));
    chart2.draw(data2, google.charts.Line.convertOptions(options2));
    chart3.draw(data3, google.charts.Line.convertOptions(options3));

}
/*function drawChart() {
    let toChartApi = [];
    let toChartApi2 = [];
    let toChartApi3 = [];
    
    dominio.forEach((value, index) => {
        toChartApi2.push([value, amostrasI2[index]]);
    });
    dominio.forEach((value, index) => {
        toChartApi3.push([value, amostrasI3[index]]);
    });
    var data = google.visualization.arrayToDataTable([
        ['t', 'I']
    ].concat(toChartApi));
    var data2 = google.visualization.arrayToDataTable([
        ['t', 'I']
    ].concat(toChartApi2));
    var data3 = google.visualization.arrayToDataTable([
        ['t', 'I']
    ].concat(toChartApi3));


    var options = {
        title: 'M_35ZH135',
        curveType: 'function',
        legend: { position: 'bottom' }
    };
    var options2 = {
        title: 'M_SAE1020',
        curveType: 'function',
        legend: { position: 'bottom' }
    };
    var options3 = {
        title: 'Hiperco_50',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    var chart2 = new google.visualization.LineChart(document.getElementById('curve_chart2'));
    var chart3 = new google.visualization.LineChart(document.getElementById('curve_chart3'));

    chart.draw(data, options);
    chart2.draw(data2, options2);
    chart3.draw(data3, options3);
} */


function interpolacao(p1, p2, value) {
    //encontrar a equacao da reta y = mx + b e encontrar o valor de H nessa reta partindo do valor
    let m = (p2[0] - p1[0]) / (p2[1] - p1[1]); // m = y2 - y1 / x2 - x1
    let b = p1[0] - p1[1] * m // b = y - mx

    return value * m + b; // retorna y(value)
}