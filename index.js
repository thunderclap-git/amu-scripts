const form = document.querySelector('[calc-element="wrapper"]');

form.addEventListener('change', (e) => {
    handleChange(e.target.name, e.target.value)
})

const fields = form.querySelectorAll('[fs-rangeslider-element="wrapper"]')

const salaryInput = fields[0].getElementsByTagName('input')[0]
const salaryMirror = fields[0].querySelector('[calc-element="display-value"]')

const emiInput = fields[1].getElementsByTagName('input')[0]
const emiMirror = fields[1].querySelector('[calc-element="display-value"]')

const tenureInput = fields[2].getElementsByTagName('input')[0]
const tenureMirror = fields[2].querySelector('[calc-element="display-value"]')

const eligibleEmi = document.querySelector('[calc-result="eligible-emi"]');
const eligileLoan = document.querySelector('[calc-result="eligible-loan"]');


function handleChange(name, value) {
    // updating mirror values
    if(name === 'salary') salaryMirror.innerHTML = value;
    else if (name === 'existing-emi') emiMirror.innerHTML = value;
    else if (name === 'tenure') tenureMirror.innerHTML = value;

    calculateMonthlyPayment()
}

function calculateMonthlyPayment() {
	const net_salary = parseInt(salaryInput.value);
	const ex_emi = parseInt(emiInput.value);
	const tenures = parseInt(tenureInput.value);

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