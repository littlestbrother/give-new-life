let oneTimeDonation = true;
let donationFrequency = null;

const disableDonateButton = () => { $("#donate-button").attr('disabled', 'disabled') };
const disableDonationFrequencyDropDown = () => { $("#donation-frequency").attr('disabled', 'disabled') };

const enableDonateButton = () => { $("#donate-button").removeAttr('disabled') };
const enableDonationFrequencyDropDown = () => { $("#donation-frequency").removeAttr('disabled') };

// disabled drop down if one time donation is enabled
$("#donation-one-time").click(() => {
	oneTimeDonation = true;
	disableDonationFrequencyDropDown();
	enableDonateButton();
});

// enable drop down if reoccurring donation is enabled
$("#donation-reoccurring").click(() => {
	oneTimeDonation = false;
	enableDonationFrequencyDropDown();

	// disabled donate button if no valid option is selected
	if ($("#donation-frequency").val().length <= 0) {
		donationFrequency = null;
		// disable button
		disableDonateButton();
	}
});

// update variable "donationFrequency" on option change
$("#donation-frequency").on('change', () => {
	// check that a valid option was pressed
	const selectedFrequency = $("#donation-frequency").val();
	if (selectedFrequency.length <= 0) {
		donationFrequency = null;
		// disable donate button if not valid
		disableDonateButton();
	} else {
		donationFrequency = selectedFrequency;
		enableDonateButton();
	}
	console.log(donationFrequency);
});

const heartMinistriesURL = (donationAmount) => {
	// HTML values => Human values => Heart Ministries API values
	// null => One Time => null
	// RWOM => Recurring weekly on Monday => 5
	// REOW => Recurring every other week => 8 
	// RMOT1 => Recurring monthly on the 1st => 1
	// RMOT5 => Recurring monthly on the 5th => 2
	// RMOT10 => Recurring monthly on the 10th => 3
	// RMOT20 => Recurring monthly on the 20th => 4
	// RQ => Recurring quarterly => 9 
	// RY => Recurring yearly => 7

	let frequency;

	switch (donationFrequency) {
		case 'RWOM':
			frequency = '5'
			break;

		case 'REOW':
			frequency = '8'
			break;

		case 'RMOT1':
			frequency = '1'
			break;

		case 'RMOT5':
			frequency = '2'
			break;

		case 'RMOT10':
			frequency = '3'
			break;

		case 'RMOT20':
			frequency = '4'
			break;

		case 'RQ':
			frequency = '9'
			break;

		case 'RY':
			frequency = '7'
			break;

		default:
			frequency = ''
			break;
	}

	return `https://heartministriesinc-bloom.kindful.com/campaigns/1199458?utf8=%E2%9C%93&campaigns=1199458&amount=${donationAmount}&recurring=landing_recurring&frequency=${frequency}`;
}

// redirect user on button click using donation form options
$("#donate-button").click(() => {

	// get amount of money (USD) user wants to donate
	const amountDonation = $("#donation-amount").val();

	const redirectURL = donationFrequency ? heartMinistriesURL(amountDonation) : `https://heartministriesinc-bloom.kindful.com/campaigns/1199458?utf8=%E2%9C%93&campaigns=1199458&amount=${amountDonation}&recurring=landing_recurring&frequency=`;
	window.location.href = redirectURL;
});

