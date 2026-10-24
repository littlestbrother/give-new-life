// Donation box: sends the donor to the Heart Ministries (Kindful) checkout.
// The form's current state is read at click time, so what the donor sees is
// always what gets sent, even after the browser restores the form on Back/reload.

const DONATION_BASE_URL = 'https://heartministriesinc-bloom.kindful.com/campaigns/1201021';
const DONATION_CAMPAIGN = '1199458';

// Form option value => Kindful frequency code
const FREQUENCY_CODES = {
	RWOM: '5',   // Recurring weekly on Monday
	REOW: '8',   // Recurring every other week
	RMOT1: '1',  // Recurring monthly on the 1st
	RMOT5: '2',  // Recurring monthly on the 5th
	RMOT10: '3', // Recurring monthly on the 10th
	RMOT20: '4', // Recurring monthly on the 20th
	RQ: '9',     // Recurring quarterly
	RY: '7',     // Recurring yearly
};

const isRecurring = () => $('#donation-reoccurring').is(':checked');
const selectedFrequency = () => (isRecurring() ? FREQUENCY_CODES[$('#donation-frequency').val()] : '') || '';

const donationAmount = () => {
	const amount = Number($('#donation-amount').val());
	return Number.isFinite(amount) && amount > 0 ? amount : null;
};

const canDonate = () => donationAmount() !== null && (!isRecurring() || selectedFrequency() !== '');

// Sync the dropdown and button with the radio buttons and inputs
const updateDonationForm = () => {
	$('#donation-frequency').prop('disabled', !isRecurring());
	$('#donate-button').prop('disabled', !canDonate());
};

const donationURL = () => {
	const params = new URLSearchParams({
		utf8: '✓',
		campaigns: DONATION_CAMPAIGN,
		amount: String(donationAmount()),
		recurring: 'landing_recurring',
		frequency: selectedFrequency(),
	});
	return `${DONATION_BASE_URL}?${params}`;
};

const donate = (event) => {
	if (event) event.preventDefault();
	if (!canDonate()) return;
	window.location.href = donationURL();
};

$('#donation-one-time, #donation-reoccurring, #donation-frequency').on('change', updateDonationForm);
$('#donation-amount').on('input change', updateDonationForm);
$('#donate-button').on('click', donate);
// Pressing Enter in the amount box submits the form; donate instead of reloading the page
$('#donation-amount').closest('form').on('submit', donate);

// Browsers can restore form values on Back or reload, after this script first runs
$(window).on('pageshow', updateDonationForm);
updateDonationForm();
