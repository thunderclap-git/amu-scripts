const salaryInput = document.querySelector('[range-input="salary"]');
const salaryMirror = document.querySelector('[range-input-mirror="salary"]');

salaryMirror.value = 10000;

const emiInput = document.querySelector('[range-input="emi"]');
const emiMirror = document.querySelector('[range-input-mirror="emi"]');

emiMirror.value = 500;

const tenureInput = document.querySelector('[range-input="tenure"]');
const tenureMirror = document.querySelector('[range-input-mirror="tenure"]');

tenureMirror.value = 0.5;

const eligibleEmi = document.querySelector('[calc-result="eligible-emi"]');
const eligileLoan = document.querySelector('[calc-result="eligible-loan"]');


salaryInput.addEventListener('change', function (e) {
	const salary = e.target.value;
	salaryMirror.value = salary;
	calculateMonthlyPayment();
});

emiInput.addEventListener('change', function (e) {
	const emi = e.target.value;
	emiMirror.value = emi;
	calculateMonthlyPayment();
});

tenureInput.addEventListener('change', function (e) {
	const tenure = e.target.value;
	tenureMirror.value = tenure;
	calculateMonthlyPayment();
});

function calculateMonthlyPayment() {
	const net_salary = salaryInput.value;
	const ex_emi = emiInput.value;
	const tenures = tenureInput.value;

	const fixed_FOIR = 60;
	const consumed = (ex_emi / net_salary) * 100;

	const balance = fixed_FOIR - consumed;
	const tenure_into_month = tenures * 12;
	const ROI = 10;
	const per_month = ROI / 12;
	const eligible_emi = net_salary * (balance / 100);
	const total_to_repay = eligible_emi * tenure_into_month;
	const step_11 = (1500 * 18) / 100 + 1500;
	const step_12 = total_to_repay * (ROI / 100);
	const step_13 = step_12 * tenures;
	const step_14 = total_to_repay - step_13;
	const step_15 = step_14 - step_11;

	
	if(eligible_emi < 0) eligibleEmi.innerHTML = 'Non Eligible';
	else eligibleEmi.innerHTML = '₹' + eligible_emi.toFixed(0);
	
	if(step_14 < 0) eligileLoan.innerHTML = 'Non Eligible'
	else eligileLoan.innerHTML = '₹' + step_14.toFixed(0);
	
	if(eligible_emi < 0 || step_14 < 0) updateChart(1, 0);
	else updateChart(step_14.toFixed(0), eligible_emi.toFixed(0));

}

const calcChart = document.querySelector('[calc-chart]');

Chart.defaults.global.legend.display = false;

const canvas = calcChart.querySelector('canvas');
canvas.style.width = '100%';
canvas.style.height = '100%';

let data = {
	labels: ['Eligible loan', 'Eligible emi'],
	datasets: [
		{
			label: 'My First Dataset',
			data: [300, 50],
			backgroundColor: ['rgb(199, 219, 216)', 'rgb(249, 249, 238)'],
			hoverOffset: 4,
			options: {
				legend: {
					display: false,
				},
			},
		},
	],
};

const config = {
	type: 'pie',
	data: data,
};

const myChart = new Chart('emi-chart', config);
//   Chart.defaults.global.legend.display = false;
data.options.plugins.legend.display = false;

function updateChart(loan, emi) {
	data.datasets[0].data[0] = loan;
	data.datasets[0].data[1] = emi;
	myChart.update();
}

calculateMonthlyPayment();
