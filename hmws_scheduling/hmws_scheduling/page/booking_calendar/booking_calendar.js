frappe.pages['booking_calendar'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Booking Calendar',
		single_column: true
	});
}