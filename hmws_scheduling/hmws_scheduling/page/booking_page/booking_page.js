frappe.pages["booking_page"].on_page_load = function (wrapper) {
	var page = frappe.ui.make_app_page({
	  parent: wrapper,
	  title: "Booking Calendar",
	  single_column: true,
	});
  
	const githubFileUrl =
	  "https://api.github.com/repos/Dhruvipatel12/full_calendar/contents/index.global.min.js";
	loadGitHubFile(githubFileUrl);
  
	async function loadGitHubFile(url) {
	  try {
		const response = await fetch(url);
		const data = await response.json();
  
		if (response.ok) {
		  // Decode the content from Base64
		  const decodedContent = atob(data.content);
  
		  // Create a script element and set its content
		  const script = document.createElement("script");
		  script.textContent = decodedContent;
  
		  // Append the script to the head
		  document.head.appendChild(script);
		} else {
		  console.error("Failed to fetch GitHub file:", data.message);
		}
	  } catch (error) {
		console.error("Error fetching GitHub file:", error);
	  }
	}
  
	let script1 = document.createElement("script");
	script1.innerHTML = `
			  
						  var events = [];
  
						  
						  let val = "";
					  
					  function selected_project() {
						  let selectemp = document.getElementById("project_select").value;
						  val = selectemp;
						  // events1 = [];
					  
						  if (selectemp) {
							  events1=[]
							  frappe.call({
								  method: "frappe.client.get_list",
								  args: {
									  doctype: "Project",
									  fields: ["*"],
									  filters: {
										  name: selectemp
									  }
								  },
								  callback: function (r) {
									  
									  if (r.message && r.message.length > 0) {
										  let resp_data = r.message[0];
										  let dt = {
											  id:resp_data.name,
											  title: resp_data.project_name,
											  start: resp_data.expected_start_date,
											  end: resp_data.expected_end_date,
											  url: "http://127.0.0.1:8006/app/project/" + resp_data.name,
											  color: '#FFAC33',
											  textColor: 'black'
										  };
										  events1.push(dt);
										  // frappe.call({
										  // 	method: "frappe.client.get_list",
										  // 	args: {
										  // 		doctype: "Task",
										  // 		fields: ["name"],
										  // 		filters: {
										  // 			project: selectemp
										  // 		}
										  // 	},
										  // 	callback: function(response) {
										  // 		console.log("demo", response);
										  
										  // 		// Map the response to an array of task names
												  // var taskNames = response.message.map(function(task) {
												  // 	return task.name;
												  // });
										  
										  // 		console.log("Task Names:", taskNames);
										  
										  // 		// Now you can use the 'taskNames' array
										  // 		// Loop through each task and fetch child table values
												  // taskNames.forEach(function(taskName) {
												  // 	frappe.call({
												  // 		method: "frappe.client.get",
												  // 		args: {
												  // 			doctype: "Task",
												  // 			name: taskName,
												  // 			fields: ["*"]
												  // 		},
												  // 		callback: function(taskResponse) {
												  // 			console.log("Task Details:", taskResponse);
  
												  // taskResponse.forEach((data) => {
												  // 	let dt1 = {
												  // 		title: data.name + " - " + data.custom_kit+"-"+ data.custom_vehicle,
												  // 		start: data.exp_start_date,
												  // 		end: data.exp_end_date,
												  // 		url: "http://127.0.0.1:8006/app/task/" + data.name,
												  // 		color: '#ADD918',
												  // 		textColor: 'black'
												  // 	};
													  
												  // 	events1.push(dt1);
												  // });
					  
												  
										  // 		show_calander()
										  
															  
										  // 				},
										  // 				error: function(err) {
										  // 					console.error("Error occurred while fetching task details:", err);
										  // 					// Handle errors here if needed
										  // 				}
										  // 			});
										  // 		});
										  // 	},
										  // 	error: function(err) {
										  // 		console.error("Error occurred:", err);
										  // 		// Handle errors here if needed
										  // 	}
										  // });
										  
										  
										  
										  frappe.call({
											  method: "frappe.client.get_list",
											  args: {
												  doctype: "Task",
												  fields: ["name", "project", "custom_vehicle", "custom_kit","exp_start_date","exp_end_date"],
												  filters: {
													  project: selectemp,
												  }
											  },
											  callback: function (r) {
												  let tsk_data = r.message;
												  // console.log("taskkkkkkkkkkkkkkkkkkkkkkkkkkk	",tsk_data)
												  
												  tsk_data.forEach((data) => {
													  let dt1 = {
														  id:data.name,
														  title: data.name + " - " + data.custom_kit+"-"+ data.custom_vehicle,
														  start: data.exp_start_date,
														  end: data.exp_end_date,
														  url: "http://127.0.0.1:8006/app/task/" + data.name,
														  color: '#ADD918',
														  textColor: 'black'
													  };
													  
													  events1.push(dt1);
												  });
					  
												  
												  show_calander()
												  
					  
												  // Use 'events1' array as needed
											  },
										  });
					  
									  } else {
										  console.log("No data found for the specified filter.");
									  }
					  
								  },
							  });
							  frappe.call({
								  method: "frappe.client.get_list",
								  args: {
									  doctype: "Task",
									  fields: ["name", "project"],
									  filters: {
										  project: val
									  }
								  },
								  callback: function (r) {
									  let resp_data = r.message;
									  let select_div = document.getElementById("task");
									  select_div.innerHTML = "";
									  let option1 = document.createElement("option");
										  option1.text = "";
										  select_div.appendChild(option1);
									  resp_data.forEach((data) => {
										  let option = document.createElement("option");
										  option.text = data.name;
										  select_div.appendChild(option);
									  });
									  task_details();
								  },
							  });
							  frappe.call({
								  method:"frappe.client.get_list",
								  args:{
									  doctype:"Vehicle",
									  fields:["name"],
									  filters:{
										  custom_project:document.getElementById("project_select").value,
										  // custom_status:"Not Assigned"
										  
									  }
								  },
								  callback:function(r){
									  let vehical_data = r.message;
									  
									  let select_veh = document.getElementById("vehical");
		  
									  vehical_data.forEach((data) => {
										  // Check if the status is not equal to "completed"
										  if (data.status !== "Completed") {
											  let option = document.createElement("option");
											  option.text = data.name;
											  select_veh.appendChild(option);
										  }
									  });
								  }
							  });
							  frappe.call({
								  method:"frappe.client.get_list",
								  args:{
									  doctype:"Kit",
									  fields:["name"],
									  filters:{
										  project:document.getElementById("project_select").value,
										  // status:"Not Assigned"
									  }
								  },
								  callback:function(r){
									  let kit_data = r.message;
									  
									  let select_kit = document.getElementById("kit");
		  
									  kit_data.forEach((data) => {
										  // Check if the status is not equal to "completed"
										  if (data.status !== "Completed") {
											  let option = document.createElement("option");
											  option.text = data.name;
											  select_kit.appendChild(option);
										  }
									  });
								  }
							  });
							  
						  } else {
							  console.log("Selectdiv is empty or undefined. Please check the value.");
						  }
					  }
					  function show_calander(){
						  var calendarEl = document.getElementById('calendar');
						  var calendar = new FullCalendar.Calendar(calendarEl, {
							  initialView: 'dayGridMonth',
							  initialDate: '2024-02-20',
							  editable: true,
							  headerToolbar: {
								  left: 'prev,next today',
								  center: 'title',
								  right: 'dayGridMonth,timeGridWeek,timeGridDay'
							  },
  
							  events: events1,
							  eventResize: function(info) {
								  console.log(info)
								  let get_event = info.event
								  let event_id=get_event.id
								  // console.log("hello",event_id);
								  let event_start_date=get_event.start
								  let event_end_date=get_event.end
								  let event_backgroundColor=get_event.backgroundColor
								  let formatted_start_date = event_start_date.toISOString().slice(0, 10);
								  let formatted_end_date = event_end_date.toISOString().slice(0, 10)
								  console.log(formatted_start_date);
								  console.log(formatted_end_date);
								  if(event_backgroundColor=="#ADD918"){
									  event_backgroundColor="Task"
									  console.log(event_backgroundColor)
									  frappe.call({
										  method:"hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.change_task_date",
										  args: {
											  event_id: event_id,
											  start_date: formatted_start_date,
											  end_date: formatted_end_date,
											  // exp_end_date:formatted_end_date
										  },
									  })
								  }
								  if(event_backgroundColor=="#FFAC33"){
									  event_backgroundColor="Project"
									  console.log(event_backgroundColor)
									  frappe.call({
										method:"hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.change_project_date",
										args: {
											event_id: event_id,
											start_date: formatted_start_date,
											end_date: formatted_end_date,
										},
									})
								  }
								  
								},
							  eventDrop:function(events){
								let get_event = events.event
								let event_id=get_event.id
								let event_start_date=get_event.start
								let event_end_date=get_event.end
								let event_backgroundColor=get_event.backgroundColor
								let formatted_start_date = event_start_date.toISOString().slice(0, 10);
								let formatted_end_date = event_end_date.toISOString().slice(0, 10)
								console.log(formatted_start_date);
								console.log(formatted_end_date);
								if(event_backgroundColor=="#ADD918"){
									event_backgroundColor="Task"
									console.log(event_backgroundColor)
									frappe.call({
										method:"hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.change_task_date",
										args: {
											event_id: event_id,
											start_date: formatted_start_date,
											end_date: formatted_end_date,
										},
									})
								}
								if(event_backgroundColor=="#FFAC33"){
									event_backgroundColor="Project"
									console.log(event_backgroundColor)
									frappe.call({
									  method:"hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.change_project_date",
									  args: {
										  event_id: event_id,
										  start_date: formatted_start_date,
										  end_date: formatted_end_date,
									  },
								  })
								}
								
								
  
							  }
						  })
						  calendar.render();
					  }	
				  function task_details(){
					  let select_task = document.getElementById("task").value;
					  frappe.call({
						  method:"frappe.client.get_list",
						  args:{
							  doctype:"Task",
							  fields:["name","project","custom_vehicle","custom_kit","exp_start_date","exp_end_date"],
							  filters:{
								  name:select_task
							  }
						  },
						  callback:function(r){
							  let task_data = r.message;
							  
							  
							  // Check if the response has data
							  if (task_data && task_data.length > 0) {
								  let data = task_data[0]; // Assuming only one task is returned
								  document.getElementById("end_date").value = data["exp_end_date"];
								  document.getElementById("kit").value = data["custom_kit"];
								  document.getElementById("vehical").value = data["custom_vehicle"];
								  document.getElementById("start_date").value = data["exp_start_date"];
  
								  
  
							  } else {
								  console.log("No data found for the specified task.");
							  }
						  }
					  });
					  frappe.call({
						  method:"hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.get_sub_task",
						  args:{
							  
								  task:document.getElementById("task").value,
							  
						  },
						  callback:function(r){
							  
							  let kit_data = r.message;
							  let select_kit = document.getElementById("job_role");
							  let sub= document.getElementById("sub_task");
							  for(let i1=0;i1<kit_data[0].length;i1++)
							  {
								  let option = document.createElement("option");
								  option.text = kit_data[0][i1];
								  select_kit.appendChild(option);
  
								  let option1 = document.createElement("option");
								  option1.text = kit_data[2][i1];
								  sub.appendChild(option1);
								  
							  }
						  }
					  });
				  
				  }
				  function get_employee() {
					  console.log("get_employee function called");  // Add this line for debugging
					  frappe.call({
						  method: "hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.get_emp_list",
						  args: {
							  job_role: document.getElementById("job_role").value,
						  },
						  callback: function(r) {
							  let emp_list = r.message;
							  let select_kit = document.getElementById("employee_select");
							  select_kit.innerHTML = "";  // Clear existing options
							  for (let i1 = 0; i1 < emp_list.length; i1++) {
								  let option = document.createElement("option");
								  option.text = emp_list[i1];
								  select_kit.appendChild(option);
							  }
						  }
					  });
				  }
				  
				  function selected_employee() {
					  frappe.call({
						  method: "hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.employee_leave",
						  args: {
							  emp_id: document.getElementById("employee_select").value,
							  s_dt: document.getElementById("start_date").value,
							  e_dt: document.getElementById("end_date").value,
						  },
						  callback: function (r) {
							  let data = r.message;
							  // let events1 = [];
							   let confirmationMessage = "";
							  for (let i1 = 0; i1 < data.leave_id.length; i1++) {
								  let dt1 = {
									  title: "Leave || " + document.getElementById("employee_select").value ,
									  start: data.start_date[i1],
									  end: data.end_date[i1],
									  url: "http://127.0.0.1:8006/app/leave-application/" + data.leave_id[i1],
									  color: '#ACCBF3',
									  textColor: 'black'
								  };
								  events1.push(dt1);
							  }
				  
							  show_calander();
				  
							  if (data.leave_id[0]) {
								  frappe.confirm(
									  'Employee ' + document.getElementById("employee_select").value + ' is on leave from date ' + data.start_date[0] + " to " + data.end_date[0],
									  function () {
										  // Code to execute if the user clicks "OK"
										  console.log('User clicked OK');
									  },
									  function () {
										  // Code to execute if the user clicks "Cancel"
										  console.log('User clicked Cancel');
									  }
								  );
							  }
				  
							  frappe.call({
								  method: "hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.employee_booking",
								  args: {
									  emp_id: document.getElementById("employee_select").value,
									  s_dt: document.getElementById("start_date").value,
									  e_dt: document.getElementById("end_date").value,
								  },
								  callback: function (r) {
									  let data = r.message;
				  
									  for (let i1 = 0; i1 < data.book_id.length; i1++) {
										  let dt1 = {
											  title: "Booked || " + document.getElementById("employee_select").value,
											  start: data.start_date[i1],
											  end: data.end_date[i1],
											  url: "http://127.0.0.1:8006/app/booking/" + data.book_id[i1],
											  color: '#ACCBF3',
											  textColor: 'black'
										  };
										  events1.push(dt1);
									  }
				  
									  show_calander();
				  
									  if (data.book_id[0]) {
										  frappe.confirm(
											  'Employee ' + document.getElementById("employee_select").value + ' already booked from date ' + data.start_date[0] + " to " + data.end_date[0],
											  function () {
												  // Code to execute if the user clicks "OK"
												  console.log('User clicked OK');
											  },
											  function () {
												  // Code to execute if the user clicks "Cancel"
												  console.log('User clicked Cancel');
											  }
										  );
									  }
									  frappe.call({
										  method: "hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.get_expiry_data",
										  args: {
											  emp_id: document.getElementById("employee_select").value,
											  s_dt: document.getElementById("start_date").value,
											  e_dt: document.getElementById("end_date").value,
										  },
										  callback: function (r) {
											  let data = r.message;
											  let confirmationMessage = "";
											  console.log(data["document_names"])
						  
											  for (let i1 = 0; i1 < data.document_names.length; i1++) {
												  //
												  let dt1 = {
													  title: "Certificate || " + document.getElementById("employee_select").value,
													  start: data.expiry_dates[i1],
													  
													  url: "http://127.0.0.1:8006/app/booking/" + data.document_names[i1],
													  color: 'pink',
													  textColor: 'black'
												  };
												  events1.push(dt1);
											  }
												  
											  
											  for (let i = 0; i < data.document_names.length; i++) {
												  confirmationMessage += " " + data.document_names[i] + " has an expired certificate: " + data.expiry_dates[i] + "<br>";
											  }
									  
											  if (confirmationMessage !== "") {
												  frappe.confirm(
													  confirmationMessage,
													  function () {
														  // Code to execute if the user clicks "OK"
														  console.log('User clicked OK');
													  },
													  function () {
														  // Code to execute if the user clicks "Cancel"
														  console.log('User clicked Cancel');
													  }
												  );
											  }
													  
												  
						  
											  show_calander();
						  
											  
										  }
									  });
  
  
									  frappe.call({
										  method: "hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.get_certificate",
										  args: {
											  emp_id: document.getElementById("employee_select").value,
											  task: document.getElementById("task").value,
											  start_date:document.getElementById("start_date").value,
											  start_date:document.getElementById("start_date").value,
											  end_date:document.getElementById("end_date").value,
										  },
										  callback: function (r) {
											  let data = r.message;
											  console.log(data)
											  let confirmationMessage = " "; // Add a space here
  
  
									  
											  for (let i1 = 0; i1 < data.differences.length; i1++) {
												  confirmationMessage += data.employee_names_emp[0] + " has a No certificate name: " + data.differences[i1] + "<br>";
											  }
											  
											  if (confirmationMessage !== "") {
												  frappe.confirm(
													  
													  confirmationMessage,
													  function () {
														  // Code to execute if the user clicks "OK"
														  console.log('User clicked OK');
													  },
													  function () {
														  // Code to execute if the user clicks "Cancel"
														  console.log('User clicked Cancel');
													  }
												  );
											  }
									  
											  show_calander();
										  }
									  });
									  
									  
								  }
							  });
						  }
					  });
				  }
				  
				  
			  frappe.call({
				  method: "frappe.client.get_list",
				  args: {
					  doctype: "Project",
					  fields: ["project_name", "status", "name"],
				  },
				  callback: function (r) {
					  let resp_data = r.message;
			  
					  let select_div = document.getElementById("project_select");
			  
					  resp_data.forEach((data) => {
						  // Check if the status is not equal to "completed"
						  if (data.status !== "Completed") {
							  let option = document.createElement("option");
							  option.text = data.name;
							  select_div.appendChild(option);
						  }
					  });
				  },
			  });
			  function myfunc() {
				  frappe.call({
					  method: "frappe.client.insert",
					  args: {
						  "doc": {
							  doctype: "Booking",
							  task: document.getElementById("task").value,
							  job_role: document.getElementById("job_role").value,
							  employee: document.getElementById("employee_select").value,
							  project: document.getElementById("project_select").value,
							  start_date: document.getElementById("start_date").value,
							  end_date: document.getElementById("end_date").value,
							  // vehicle: document.getElementById("vehicle").value,
							  // kit: document.getElementById("kit").value,
							  sub_task: document.getElementById("sub_task").value,
						  }
					  },
					  callback: function (r) {
						  console.log(r);
					  }
				  });
			  }
  
  
  
			  //for a fielter load
			  
			  frappe.call({
				  method: "frappe.client.get_list",
				  args: {
					  doctype: "Project",
					  fields: ["project_name", "status", "name"],
				  },
				  callback: function (r) {
					  let resp_data = r.message;
			  
					  let select_div = document.getElementById("project_select_for_all");
			  
					  resp_data.forEach((data) => {
						  // Check if the status is not equal to "completed"
						  if (data.status !== "Completed") {
							  let option = document.createElement("option");
							  option.text = data.name;
							  select_div.appendChild(option);
						  }
					  });
				  },
			  });
			  frappe.call({
				  method: "frappe.client.get_list",
				  args: {
					  doctype: "Project",
					  fields: ["name", "project_name", "expected_start_date", "expected_end_date"],
				  },
				  callback: function (r) {
					  if (r.message && r.message.length > 0) {
						  for (var i = 0; i < r.message.length; i++) {
							  let resp_data = r.message[i];
							  let event = {
								  id:resp_data.name,
								  title: resp_data.project_name,
								  start: resp_data.expected_start_date,
								  end: resp_data.expected_end_date,
								  url: "http://127.0.0.1:8006/app/project/" + resp_data.name,
								  color: '#FFAC33',
								  textColor: 'black'
							  };
							  events.push(event);
						  }
			  
						  var calendarEl = document.getElementById('calendar');
			  
						  var calendar = new FullCalendar.Calendar(calendarEl, {
							  initialView: 'dayGridMonth',
							  initialDate: '2024-02-20',
							  editable: true,
							  headerToolbar: {
								  left: 'prev,next today',
								  center: 'title',
								  right: 'dayGridMonth,timeGridWeek,timeGridDay'
							  },
							  events: events,
							  eventResize: function(info) {
								  console.log(info)
								  let get_event = info.event
								  let event_id=get_event.id
								  let event_start_date=get_event.start
								  let event_end_date=get_event.end
								  let event_backgroundColor=get_event.backgroundColor
								  let formatted_start_date = event_start_date.toISOString().slice(0, 10);
								  let formatted_end_date = event_end_date.toISOString().slice(0, 10)
								  console.log(formatted_start_date);
								  console.log(formatted_end_date);
								  if(event_backgroundColor=="#ADD918"){
									  event_backgroundColor="Task"
									  console.log(event_backgroundColor)
									  frappe.call({
										  method:"hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.change_task_date",
										  args: {
											  event_id: event_id,
											  start_date: formatted_start_date,
											  end_date: formatted_end_date,
										  },
									  })
								  }
								  if(event_backgroundColor=="#FFAC33"){
									  event_backgroundColor="Project"
									  console.log(event_backgroundColor)
									  frappe.call({
										method:"hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.change_project_date",
										args: {
											event_id: event_id,
											start_date: formatted_start_date,
											end_date: formatted_end_date,
										},
									})
								  }
								  
								},
							  eventDrop:function(events){
								  let get_event = events.event
								  let event_id=get_event.id
								  let event_start_date=get_event.start
								  let event_end_date=get_event.end
								  let event_backgroundColor=get_event.backgroundColor
								  let formatted_start_date = event_start_date.toISOString().slice(0, 10);
								  let formatted_end_date = event_end_date.toISOString().slice(0, 10)
								  console.log(formatted_start_date);
								  console.log(formatted_end_date);
								  if(event_backgroundColor=="#ADD918"){
									  event_backgroundColor="Task"
									  console.log(event_backgroundColor)
									  frappe.call({
										  method:"hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.change_task_date",
										  args: {
											  event_id: event_id,
											  start_date: formatted_start_date,
											  end_date: formatted_end_date,
										  },
									  })
								  }
								  if(event_backgroundColor=="#FFAC33"){
									  event_backgroundColor="Project"
									  console.log(event_backgroundColor)
									  frappe.call({
										method:"hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.change_project_date",
										args: {
											event_id: event_id,
											start_date: formatted_start_date,
											end_date: formatted_end_date,
										},
									})
								  }
								  
								  
	
							  }
						  });
			  
						  calendar.render();
					  }
				  }
			  });
			  
  
			  function selected_project_onload() {
				  let selectpro = document.getElementById("project_select_for_all").value;
				  events1 = [];
			  
				  frappe.call({
					  method: "frappe.client.get_list",
					  args: {
						  doctype: "Project",
						  fields: ["*"],
						  filters: {
							  name: selectpro
						  }
					  },
					  callback: function (r) {
						  if (r.message && r.message.length > 0) {
							  let resp_data = r.message[0];
							  let dt = {
								  id:resp_data.name,
								  title: resp_data.project_name,
								  start: resp_data.expected_start_date,
								  end: resp_data.expected_end_date,
								  url: "http://127.0.0.1:8006/app/project/" + resp_data.name,
								  color: '#FFAC33',
								  textColor: 'black'
							  };
							  events1.push(dt);
							  // console.log("hoiiiiiiiiiiiiiiiii",events1)
						  }
						  var calendarEl = document.getElementById('calendar');
			  
						  var calendar = new FullCalendar.Calendar(calendarEl, {
							  initialView: 'dayGridMonth',
							  initialDate: '2024-02-20',
							  editable: true,
							  headerToolbar: {
								  left: 'prev,next today',
								  center: 'title',
								  right: 'dayGridMonth,timeGridWeek,timeGridDay'
							  },
							  events: events1,
							  eventResize: function(info) {
								  console.log(info)
								  let get_event = info.event
								  let event_id=get_event.id
								  let event_start_date=get_event.start
								  let event_end_date=get_event.end
								  let event_backgroundColor=get_event.backgroundColor
								  let formatted_start_date = event_start_date.toISOString().slice(0, 10);
								  let formatted_end_date = event_end_date.toISOString().slice(0, 10)
								  console.log(formatted_start_date);
								  console.log(formatted_end_date);
								  if(event_backgroundColor=="#ADD918"){
									  event_backgroundColor="Task"
									  console.log(event_backgroundColor)
									  frappe.call({
										  method:"hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.change_task_date",
										  args: {
											  event_id: event_id,
											  start_date: formatted_start_date,
											  end_date: formatted_end_date,
										  },
									  })
								  }
								  if(event_backgroundColor=="#FFAC33"){
									  event_backgroundColor="Project"
									  console.log(event_backgroundColor)
									  frappe.call({
										method:"hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.change_project_date",
										args: {
											event_id: event_id,
											start_date: formatted_start_date,
											end_date: formatted_end_date,
										},
									})
								  }
								  
								},
								eventDrop:function(events){
								  let get_event = events.event
								  let event_id=get_event.id
								  let event_start_date=get_event.start
								  let event_end_date=get_event.end
								  let event_backgroundColor=get_event.backgroundColor
								  let formatted_start_date = event_start_date.toISOString().slice(0, 10);
								  let formatted_end_date = event_end_date.toISOString().slice(0, 10)
								  console.log(formatted_start_date);
								  console.log(formatted_end_date);
								  if(event_backgroundColor=="#ADD918"){
									  event_backgroundColor="Task"
									  console.log(event_backgroundColor)
									  frappe.call({
										  method:"hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.change_task_date",
										  args: {
											  event_id: event_id,
											  start_date: formatted_start_date,
											  end_date: formatted_end_date,
										  },
									  })
								  }
								  if(event_backgroundColor=="#FFAC33"){
									  event_backgroundColor="Project"
									  console.log(event_backgroundColor)
									  frappe.call({
										method:"hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.change_project_date",
										args: {
											event_id: event_id,
											start_date: formatted_start_date,
											end_date: formatted_end_date,
										},
									})
								  }
								  
								  
	
								}
  
							  
						  });
			  
						  calendar.render();
						  // Add the rest of your code here if needed
					  }
				  });
			  }
			  function select_task() {
				  let events1 = [];
				  events: []
				  let selectcheck = document.getElementById("myCheckbox");
				  let selectpro = document.getElementById("project_select_for_all").value;
				  events1 = [];
				  console.log("events ", events1);
				  console.log("events ", selectpro);
				  console.log("events ", selectcheck);
				  if (selectcheck.checked) {
					  // Check if the checkbox is checked
					  frappe.call({
						  method: "frappe.client.get_list",
						  args: {
							  doctype: "Task",
							  fields: ["*"],
							  filters: {
								  project: selectpro,
								  parent_task: ""
								  
							  }
						  },
						  callback: function (r) {
							  let tsk_data = r.message;
			  
							  tsk_data.forEach((data) => {
								  let dt1 = {
									  id:data.name,
									  title: data.name + " - " + data.custom_vehicle,
									  start: data.exp_start_date,
									  end: data.exp_end_date,
									  url: "http://127.0.0.1:8006/app/task/" + data.name,
									  color: '#ADD918',
									  textColor: 'black'
								  };
			  
								  events1.push(dt1);
							  });
							  var calendarEl = document.getElementById('calendar');
			  
							  var calendar = new FullCalendar.Calendar(calendarEl, {
								  initialView: 'dayGridMonth',
								  initialDate: '2024-02-20',
								  headerToolbar: {
									  left: 'prev,next today',
									  center: 'title',
									  right: 'dayGridMonth,timeGridWeek,timeGridDay'
								  },
								  editable: true,
								  events: events1,
								  eventResize: function(info) {
									  console.log(info)
									  let get_event = info.event
									  let event_id=get_event.id
									  let event_start_date=get_event.start
									  let event_end_date=get_event.end
									  let event_backgroundColor=get_event.backgroundColor
									  let formatted_start_date = event_start_date.toISOString().slice(0, 10);
									  let formatted_end_date = event_end_date.toISOString().slice(0, 10)
									  console.log(formatted_start_date);
									  console.log(formatted_end_date);
									  if(event_backgroundColor=="#ADD918"){
										  event_backgroundColor="Task"
										  console.log(event_backgroundColor)
										  frappe.call({
											  method:"hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.change_task_date",
											  args: {
												  event_id: event_id,
												  start_date: formatted_start_date,
												  end_date: formatted_end_date,
											  },
										  })
									  }
									  if(event_backgroundColor=="#FFAC33"){
										  event_backgroundColor="Project"
										  console.log(event_backgroundColor)
										  frappe.call({
											method:"hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.change_project_date",
											args: {
												event_id: event_id,
												start_date: formatted_start_date,
												end_date: formatted_end_date,
											},
										})
									  }
									  
									},
								  eventDrop:function(events){
									  let get_event = events.event
									  let event_id=get_event.id
									  let event_start_date=get_event.start
									  let event_end_date=get_event.end
									  let event_backgroundColor=get_event.backgroundColor
									  let formatted_start_date = event_start_date.toISOString().slice(0, 10);
									  let formatted_end_date = event_end_date.toISOString().slice(0, 10)
									  console.log(formatted_start_date);
									  console.log(formatted_end_date);
									  if(event_backgroundColor=="#ADD918"){
										  event_backgroundColor="Task"
										  console.log(event_backgroundColor)
										  frappe.call({
											  method:"hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.change_task_date",
											  args: {
												  event_id: event_id,
												  start_date: formatted_start_date,
												  end_date: formatted_end_date,
											  },
										  })
									  }
									  if(event_backgroundColor=="#FFAC33"){
										  event_backgroundColor="Project"
										  console.log(event_backgroundColor)
										  frappe.call({
											method:"hmws_scheduling.hmws_scheduling.page.booking_page.booking_page.change_project_date",
											args: {
												event_id: event_id,
												start_date: formatted_start_date,
												end_date: formatted_end_date,
											},
										})
									  }
									  
									  
		
									}
								  
							  });
			  
							  calendar.render();
							  
						  }
					  });
				  } else {
					  // If checkbox is not checked, create the calendar with no events
					  var calendarEl = document.getElementById('calendar');
					  selected_project_onload()
					  var calendar = new FullCalendar.Calendar(calendarEl, {
						  initialView: 'dayGridMonth',
						  initialDate: '2024-02-20',
						  editable: true,
						  headerToolbar: {
							  left: 'prev,next today',
							  center: 'title',
							  right: 'dayGridMonth,timeGridWeek,timeGridDay'
						  },
						  events: []
					  });
			  
					  calendar.render();
				  }
			  }
  
  
			  function select_emp() {
				  let events1 = [];  // Initialize events1 array
			  
				  let selectcheck = document.getElementById("Employee_checkbox");
				  let selectpro = document.getElementById("project_select_for_all").value;
			  
				  console.log("events ", events1);
				  console.log("events ", selectpro);
				  console.log("events ", selectcheck);
			  
				  if (selectcheck && selectcheck.checked) {
					  // Check if the checkbox is checked
					  frappe.call({
						  method: "frappe.client.get_list",
						  args: {
							  doctype: "Task",
							  fields: ["*"],
							  filters: {
								  project: selectpro
							  }
						  },
						  callback: function (r) {
							  let tsk_data = r.message;
							  console.log(tsk_data);
							  tsk_data = tsk_data.map(function (task) {
								  return task.name;
							  });
							  console.log(tsk_data);
			  
							  // Use Promise.all to wait for all asynchronous calls to finish
							  Promise.all(tsk_data.map(function (taskName) {
								  return new Promise(function (resolve) {
									  frappe.call({
										  method: "frappe.client.get",
										  args: {
											  doctype: "Task",
											  name: taskName,
											  fields: ["*"],
											  // filters: {
											  // 	"parent_task": ["is", "null"]
											  // }
										  },
										  callback: function (taskResponse) {
											  // console.log("taskResponse",taskResponse)
											  var x = taskResponse.message.depends_on;
											  console.log("Task Details:", x, "hii");
											  console.log(typeof taskResponse);
  
											  if (Array.isArray(x)) {
												  var customEmployeeValues = []; // Array to store custom_employee values
												  
												  for (var i = 0; i < x.length; i++) {
													  var dependsOnObject = x[i];
													  console.log("c", dependsOnObject);
  
													  // Check if custom_employee exists in the current depends_on object
													  if ('custom_employee' in dependsOnObject) {
														  var customEmployeeValue = dependsOnObject.custom_employee;
														  console.log("Custom Employee Value:", customEmployeeValue);
  
														  // Store the custom_employee value in the array
														  customEmployeeValues.push(customEmployeeValue);
													  } else {
														  console.log("custom_employee not found in depends_on object");
													  }
												  }
  
												  // Concatenate the custom_employee values with commas and log the result
												  var concatenatedValues = customEmployeeValues.join(', ');
												  console.log("Concatenated Custom Employee Values:", concatenatedValues);
											  }
  
											  if (Array.isArray(taskResponse)) {
												  taskResponse.forEach((data) => {    
													  let dt1 = {
														  title:customEmployeeValue,
														  start: data.exp_start_date,
														  end: data.exp_end_date,
														  url: "http://127.0.0.1:8006/app/task/" + data.name,
														  color: '#ADD918',
														  textColor: 'black'
													  };
											  
													  events1.push(dt1);
												  });
											  } else if (typeof taskResponse === 'object') {
												  // Assuming you want to iterate over values
												  Object.values(taskResponse).forEach((data) => {    
													  let dt1 = {
														  title: concatenatedValues,
														  start: data.exp_start_date,
														  end: data.exp_end_date,
														  url: "http://127.0.0.1:8006/app/task/" + data.name,
														  color: 'pink',
														  textColor: 'black'
													  };
											  
													  events1.push(dt1);
													  console.log(events1)
												  });
												  
												  var calendarEl = document.getElementById('calendar');
					  
											  var calendar = new FullCalendar.Calendar(calendarEl, {
												  initialView: 'dayGridMonth',
												  initialDate: '2024-02-20',
												  editable: true,
												  headerToolbar: {
													  left: 'prev,next today',
													  center: 'title',
													  right: 'dayGridMonth,timeGridWeek,timeGridDay'
												  },
												  events: events1
											  });
											  
											  calendar.render();
  
											  }
											  
											  
											  resolve();
											   // Resolve the promise after processing each task
										  }
										  
										  
									  });
								  });
							  })).then(function () {
								  // Here, you can use the events1 array as needed
								  console.log("Processed events: ", events1);
							  });
						  }
					  });
				  } else {
					  console.log("Checkbox not checked");
					  selected_project_onload()
					  
				  }
			  }
			  
			  
			  
			  
			  
			  
			  
			  
			  
		  
			  
		  `;
	setTimeout(() => {
	  document.body.appendChild(script1);
	}, 2000);
   
	setTimeout(() => {
	  $(frappe.render_template("booking_page", {})).appendTo(page.body);
	}, 1000);
  };
  