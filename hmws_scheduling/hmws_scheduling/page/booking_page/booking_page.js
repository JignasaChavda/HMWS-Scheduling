var initializeCalendar = function (events) {
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
	}) // Use the events parameter here
  

    calendar.render();
};

frappe.pages['booking_page'].on_page_load = function(wrapper) {

    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: "Booking Calendar",
        single_column: true,
    });
	
    const githubFileUrl =
        "https://api.github.com/repos/Dhruvipatel12/full_calendar/contents/index.global.min.js";
    loadGitHubFile(githubFileUrl);
	var events = [];
  
						  
	let val = "";

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
	//Booking
	// add a Project to select field of Booking y
	function frappeProject2() {
		frappe.call({
			method: "frappe.client.get_list",
			args: {
				doctype: "Project",
				fields: ["project_name", "status", "name"],
			},
			callback: function (r) {
				let resp_data = r.message;
				// console.log("helooooooooooooooooooooooooooo", resp_data);
				console.log(resp_data);
	
				let select_div = $("#project_select_Booking");
				console.log("frappeProject");
	
				resp_data.forEach((data) => {
					// Check if the status is not equal to "completed"
					if (data.status !== "Completed") {
						let concatenatedValue = data.name +""+ " - "+"" + data.project_name;
						let option = new Option(concatenatedValue, data.name);
						console.log(option);
						select_div.append(option);
					}
				});
	
				// Trigger Select2 update after adding options
				select_div.trigger("change");
			},
		});
	}
	
	
    function frappeProject() {
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Project",
                fields: ["project_name", "status", "name"],
            },
            callback: function (r) {
                let resp_data = r.message;
                console.log(resp_data);

                let select_div = document.getElementById("project_select");
				console.log("frappeProject")

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
	}
	// let selectedProject = document.getElementById("project_select").value;
	// console.log("selectedProject",selectedProject)

	
	
	function frappeTask() {
		// Remove existing options from the task_select dropdown
		document.getElementById("task_select").innerHTML = "";
	
		// Check if the project field has a value
		let selectedProjects = Array.from(document.getElementById("project_select").selectedOptions).map(option => option.value);
		console.log("selectedProjects", selectedProjects);
	
		// Rest of your existing code...
		selectedProjects.forEach(selectedProject => {
			if (selectedProject) {
				frappe.call({
					method: "frappe.client.get_list",
					args: {
						doctype: "Task",
						fields: ["*"],
						filters: {
							project: selectedProject,
							parent_task: ""
						}
					},
					callback: function (r) {
						let resp_data = r.message;
						console.log("ccc", resp_data);
	
						let select_div = document.getElementById("task_select");
	
						resp_data.forEach((data) => {
							if (data.status !== "Completed") {
								let option = document.createElement("option");
								option.text = data.name;
								select_div.appendChild(option);
							}
						});
					},
				});
			}
		});
	}
	function task_details_fielter() {
        let events1 = [];

    let select_task = document.getElementById("task_select").value;

    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Task",
            fields: ["name", "project", "custom_vehicle", "custom_kit", "exp_start_date", "exp_end_date"],
            filters: {
                name: select_task
            }
        },
        callback: function (r) {
            let task_data = r.message;
            console.log(task_data, "");

            task_data.forEach((data) => {
                let dt1 = {
                    id: data.name,
                    title: data.name + " - " + data.custom_vehicle,
                    start: data.exp_start_date,
                    end: data.exp_end_date,
                    url: "http://127.0.0.1:8006/app/task/" + data.name,
                    color: '#ADD918',
                    textColor: 'black'
                };
                events1.push(dt1);
                console.log(events1, "events1 updated");
            });
            initializeCalendar(events1);
        }
    });
    }
	function employee_filter() {
		let selectedProjects = Array.from(document.getElementById("project_select").selectedOptions).map(option => option.value);
		console.log("Selected Projects:", selectedProjects);
	
		frappe.call({
			method: "frappe.client.get_list",
			args: {
				doctype: "Task",
				fields: ["*"],
				filters: {
					project: ["in", selectedProjects]
				}
			},
			callback: function (r) {
				let tsk_data = r.message;
				console.log(tsk_data);
				tsk_data = tsk_data.map(function (task) {
					return task.name;
				});
				console.log(tsk_data, "tsk_data");
	
				// Array to store events for the calendar
				let events1 = [];
	
				Promise.all(tsk_data.map(function (taskName) {
					return new Promise(function (resolve) {
						frappe.call({
							method: "frappe.client.get",
							args: {
								doctype: "Task",
								name: taskName,
								fields: ["*"],
							},
							callback: function (taskResponse) {
								var data = taskResponse.message;
								var x = taskResponse.message.depends_on;
								console.log("Task Detailsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss:", x, "hii");
	
								if (Array.isArray(x)) {
									var customEmployeeValues = [];
	
									for (var i = 0; i < x.length; i++) {
										var dependsOnObject = x[i];
										console.log("c", dependsOnObject);
	
										if ('custom_employee' in dependsOnObject) {
											var customEmployeeValue = dependsOnObject.custom_employee;
											console.log("Custom Employee Value:", customEmployeeValue);
											customEmployeeValues.push(customEmployeeValue);
										} else {
											console.log("custom_employee not found in depends_on object");
										}
									}
	
									var concatenatedValues = customEmployeeValues.join(', ');
									console.log("Concatenated Custom Employee Values:", concatenatedValues);
	
									var selectElement = document.getElementById("NewField4");
									selectElement.innerHTML = '<option value=""></option>';
	
									customEmployeeValues.forEach(function (value) {
										var option = document.createElement("option");
										option.value = value;
										option.text = value;
										selectElement.appendChild(option);
									});
	
									console.log("customEmployeeValues", customEmployeeValues);
	
									// Call the first function and wait for its completion
									frappe.call({
										method: "hmws_scheduling.hmws_scheduling.page.calendar.booking_page.employee_leave_all",
										args: {
											custom_employee_values: customEmployeeValues,
										},
										callback: function (r) {
											if (r.message && r.message.leave_details && r.message.leave_details.length > 0) {
												var data = r.message.leave_details;
	
												for (let i1 = 0; i1 < data.length; i1++) {
													let dt1 = {
														title: data[i1].employee_id+ "||On Leave  " ,
														start: data[i1].from_date,
														end: data[i1].to_date,
														url: "http://127.0.0.1:8006/app/leave-application/" + data[i1].leave_id,
														color: ' #55A5FA',
														textColor: 'black'
													};
													events1.push(dt1);
													console.log(events1, "eventsdd");
												}
	
												initializeCalendar(events1);
												console.log("Leave Details:", data);
											} else {
												console.log("Error or No Data");
											}
											// Resolve the promise after processing the first call
											resolve();
										}
									});
	
									// Call the second function and wait for its completion
									let dt1 = {
										title: concatenatedValues+"||"+data.project+"||"+data.name   ,
										start: data.exp_start_date,
										end: data.exp_end_date,
										url: "http://127.0.0.1:8006/app/task/" + data.name,
										color: '#55A5FA',
										textColor: 'black'
									};
	
									events1.push(dt1);
									
									// if (customEmployeeValues.includes(data.name)) {
										// Call the additional function for certificate_on_load
										frappe.call({
											method: "hmws_scheduling.hmws_scheduling.page.calendar.booking_page.certificate_expiry_date",
											args: {
												custom_employee_values: customEmployeeValues,
											},
											callback: function (r) {
												let data = r.message;
												// console.log("ppppppppppppppppppppppppppppppppppppppppppppppppppppppppp", data);
										
												data.leave_details.forEach((certificate) => {
													console.log(certificate.leave_id, "name of certificate");
										
													let dt1 = {
														id: certificate.name+ "- Expired:"+ certificate.document_name ,
														title: certificate.name+ "- Expired:"+ certificate.document_name ,
														start: certificate.expiry_date,
														url: "http://127.0.0.1:8006/app/task/" + certificate.leave_id,
														color: '#55A5FA',
														textColor: 'black'
													};
										
													events1.push(dt1);
													console.log(events1, "certificate");
												});
										
												initializeCalendar(events1);
											}
										});
										
									// }
									
									
									
	
									resolve();
									initializeCalendar(events1);
								}
							}
						});
					});
				})).then(function () {
					// Here, you can use the events1 array as needed
					console.log("Processed events: ", events1);
				});
			}
		});
	}
	
	function select_emp() {
		let events1 = [];  // Initialize events1 array
	
		let selectcheck = document.getElementById("Employee_checkbox");
		let selectpro = document.getElementById("project_select_for_all").value;
	
		console.log("events ", events1);
		console.log("events ", selectpro);
		console.log("events ", selectcheck);
	
		// Check if the checkbox is checked
		frappe.call({
			method: "frappe.client.get_list",
			args: {
				doctype: "Task",
				fields: ["*"],
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
							},
							callback: function (taskResponse) {
								var data = taskResponse.message;
								var x = taskResponse.message.depends_on;
								console.log("Task Details:", x, "hii");
								console.log(typeof taskResponse);
	
								if (Array.isArray(x)) {
									var customEmployeeValues = [];https://docs.google.com/document/d/1NmmUWlNnXAr6OwlBv20FaUGPfJYMMmlWG-N-KALAAgM/edit?usp=sharing
	
									for (var i = 0; i < x.length; i++) {
										var dependsOnObject = x[i];
										console.log("c", dependsOnObject);
	
										if ('custom_employee' in dependsOnObject) {
											var customEmployeeValue = dependsOnObject.custom_employee;
											console.log("Custom Employee Value:", customEmployeeValue);
											customEmployeeValues.push(customEmployeeValue);
										} else {
											console.log("custom_employee not found in depends_on object");
										}
									}
	
									var concatenatedValues = customEmployeeValues.join(', ');
									console.log("Concatenated Custom Employee Values:", concatenatedValues);
	
									// Create a common structure for event
									let dt1 = {
										title: concatenatedValues+"||"+data.project+"||"+data.name   ,
										start: data.exp_start_date,
										end: data.exp_end_date,
										url: "http://127.0.0.1:8006/app/task/" + data.name,
										color: '#55A5FA',
										textColor: 'black'
									};
	
									events1.push(dt1);
	
									// Add more conditions to populate the event based on other criteria if needed
								}
								resolve();
							}
						});
					});
				})).then(function () {
					// Here, you can use the events1 array as needed
					console.log("Processed events: ", events1);
	
					// After processing all tasks, make the final call to fetch employee_leave_on_load data
					frappe.call({
						method: "hmws_scheduling.hmws_scheduling.page.calendar.booking_page.employee_leave_on_load",
						args: {},
						callback: function (r) {
							let data = r.message;
							console.log("dattatatttadatoi", data);
	
							data.forEach((data) => {
								let dt1 = {
									id: data.name,
									title: data.employee + " - " + "On Leave",
									start: data.from_date,
									end: data.to_date,
									url: "http://127.0.0.1:8006/app/task/" + data.name,
									color: '#55A5FA',
									textColor: 'black'
								};
	
								events1.push(dt1);
							});
	
							initializeCalendar(events1);
						}
					});
					frappe.call({
						method: "hmws_scheduling.hmws_scheduling.page.calendar.booking_page.certificate_on_load",
						args: {},
						callback: function (r) {
							let data = r.message;
							var x=data.name;
							console.log(x,"name of")
							console.log("cerificate", data);
							
	
							data.forEach((certificate) => {
								// Accessing the "name" field of each certificate
								console.log(certificate.name, "name of certificate");
					
								let dt1 = {
									id: certificate.name+ "- Expired:"+ certificate.document_name ,
									title: certificate.name+ "- Expired:"+ certificate.document_name ,
									start: certificate.expiry_date,
									url: "http://127.0.0.1:8006/app/task/" + certificate.name,
									color: '#55A5FA',
									textColor: 'black'
								};
					
								events1.push(dt1);
								console.log(events1, "certificate");
							});
	
							initializeCalendar(events1);
						}
					});
				});
			}
		});
	}
		

	function selected_project() {
		let selectemp = document.getElementById("project_select_Booking").value;
		val = selectemp;
		events1 = [];


		$.ajax({
			
		})
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
						frappe.call({
						  method: "frappe.client.get_list",
						  args: {
							  doctype: "Task",
							  fields: ["name"],
							  filters: {
								  project: selectemp
							  }
						  },
						  callback: function (response) {
							  console.log("demo", response);
					  
							  // Map the response to an array of task names
							  var taskNames = response.message.map(function (task) {
								  return task.name;
							  });
					  
							  console.log("Task Names:", taskNames);
					  
							  // Fetch details for each task
							  taskNames.forEach(function (taskName) {
								  frappe.call({
									  method: "frappe.client.get",
									  args: {
										  doctype: "Task",
										  name: taskName,
										  fields: ["*"]
									  },
									  callback: function (taskResponse) {
										  console.log("Task Details:", taskResponse);
										  x = taskResponse.message.depends_on
										  if(x.length!=0)
										  {
											  console.log(x[0].custom_employee,"if x in data")
										  }
										  console.log(x,"xxxjoswjdhjsoawdfch")
					  
										  if (taskResponse.message) {
											  let data = taskResponse.message;
											  let dt1 = {
												  title: data.name + " - " + data.custom_kit + "-" + data.custom_vehicle + " - "+(x.length !== 0 ? x[0].custom_employee : ""),
												  start: data.exp_start_date,
												  end: data.exp_end_date,
												  url: "http://127.0.0.1:8006/app/task/" + data.name,
												  color: '#ADD918',
												  textColor: 'black'
											  };
											  
					  
											  events1.push(dt1);
											  console.log(events1, "events1");
										  }
										  initializeCalendar(events1);
					  
										  
									  },
									  error: function (err) {
										  console.error("Error occurred while fetching task details:", err);
										  // Handle errors here if needed
									  }
								  });
							  });
						  },
						  error: function (err) {
							  console.error("Error occurred while fetching task list:", err);
							  // Handle errors here if needed
						  }
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
					fields: ["name", "project","parent_task"],
					filters: {
						project: val,
						parent_task:""
						
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
						custom_project:document.getElementById("project_select_Booking").value,
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
						project:document.getElementById("project_select_Booking").value,
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
	var events1 = [];
	function task_details() {
        let select_task = document.getElementById("task").value;
					
							frappe.call({
								method: "frappe.client.get_list",
								args: {
									doctype: "Task",
									fields: ["name", "project", "custom_vehicle", "custom_kit", "exp_start_date", "exp_end_date"],
									filters: {
										name: select_task
										
									}
								},
								callback: function (r) {
									let task_data = r.message;
									console.log(task_data,"")
						
									// Check if the response has data
									if (task_data && task_data.length > 0) {
										let data = task_data[0]; // Assuming only one task is returned
										document.getElementById("end_date").value = data["exp_end_date"];
										document.getElementById("kit").value = data["custom_kit"];
										document.getElementById("vehical").value = data["custom_vehicle"];
										document.getElementById("start_date").value = data["exp_start_date"];
						
										// Update sub_task field within this callback
										updateSubTaskField();
									} else {
										console.log("No data found for the specified task.");
									}
								}
							});
    }
	

	function updateSubTaskField() {
		frappe.call({
			method: "hmws_scheduling.hmws_scheduling.page.calendar.booking_page.get_sub_task",
			args: {
				task: document.getElementById("task").value,
			},
			callback: function (r) {
				let kit_data = r.message;
				let select_kit = document.getElementById("job_role");
				let sub = document.getElementById("sub_task");
	
				// Clear existing options
				select_kit.innerHTML = "";
				sub.innerHTML = "";
	
				for (let i1 = 0; i1 < kit_data[0].length; i1++) {
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
			method: "hmws_scheduling.hmws_scheduling.page.calendar.booking_page.get_emp_list",
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
	function myfunc() {
		frappe.call({
			method: "frappe.client.insert",
			args: {
				"doc": {
					doctype: "Booking",
					task: document.getElementById("task").value,
					job_role: document.getElementById("job_role").value,
					employee: document.getElementById("employee_select").value,
					project: document.getElementById("project_select_Booking").value,
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




	// function selected_employee_alll(customEmployeeValues) {
	// 	frappe.call({
	// 		method: "hmws_scheduling.hmws_scheduling.page.calendar.booking_page.employee_leave_all",
	// 		args: {
	// 			custom_employee_values: customEmployeeValues,
	// 		},
	// 		callback: function (r) {
	// 			// Check if the call was successful
	// 			if (r.message && r.message.leave_details && r.message.leave_details.length > 0) {
	// 				var data = r.message.leave_details;
	// 				var events1 = [];
				
	// 				for (let i1 = 0; i1 < data.length; i1++) {
	// 					let dt1 = {
	// 						title: "Leave || " + data[i1].employee_id,
	// 						start: data[i1].from_date,
	// 						end: data[i1].to_date,
	// 						url: "http://127.0.0.1:8006/app/leave-application/" + data[i1].leave_id,
	// 						color: '#ACCBF3',
	// 						textColor: 'black'
	// 					};
	// 					events1.push(dt1);
	// 					console.log(events1, "eventsdd");
	// 				}
	// 				initializeCalendar(events1);
				
	// 				// Process the leave details as needed
	// 				console.log("Leave Details:", data);
	// 			} else {
	// 				// Handle the case when there is an error or no data
	// 				console.log("Error or No Data");
	// 			}
				
	// 		}
	// 	});
	// }
	
	
	function selected_employee() {
		frappe.call({
			method: "hmws_scheduling.hmws_scheduling.page.calendar.booking_page.employee_leave",
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
				
				initializeCalendar(events1);
	
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
					method: "hmws_scheduling.hmws_scheduling.page.calendar.booking_page.employee_booking",
					args: {
						emp_id: document.getElementById("employee_select").value,
						s_dt: document.getElementById("start_date").value,
						e_dt: document.getElementById("end_date").value,
					},
					callback: function (r) {
						let data = r.message;
						console.log("i am aditya")
	
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
	
						// show_calander();
						initializeCalendar(events1);
	
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
							method: "hmws_scheduling.hmws_scheduling.page.calendar.booking_page.get_expiry_data",
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
										
									
								initializeCalendar(events1);
								// show_calander();
			
								
							}
						});


						frappe.call({
							method: "hmws_scheduling.hmws_scheduling.page.calendar.booking_page.get_certificate",
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
									  console.log(confirmationMessage)
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
						
								// show_calander();
							}
						});
						
						
					}
				});
			}
		});
	}




	// function handleFilterChange() {
    //     var selectedValue = document.getElementById("vehicle").value;

    //     if (selectedValue === "project") {
    //         filter_project();
    //     }
    //     // Add more conditions for other values if needed
    // }
	
	
	
	// Initialize an empty array to store events
var events1 = [];

function filter_project() {
    let viewBySelect = document.getElementById("vehicle");
    let selectedValue = viewBySelect.value;
    let projectSelect = document.getElementById("project_select_for_all");

    // Clear existing options
    projectSelect.innerHTML = "";

    // If the selected value is empty, clear the calendar and return
    if (selectedValue === "") {
        clearCalendar();
        return;
    }

    // If "Project" is selected, fetch and populate the options
    if (selectedValue === "project") {
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Project",
                fields: ["project_name", "status", "name"],
            },
            callback: function (r) {
                let resp_data = r.message;

                resp_data.forEach((data) => {
                    // Check if the status is not equal to "completed"
                    if (data.status !== "Completed") {
                        let option = document.createElement("option");
                        option.text = data.name;
                        projectSelect.appendChild(option);
                    }
                });

                // Fetch and populate project data
                project_data();
            },
        });
    } else if (selectedValue === "job") {
		 
        // Fetch and populate job data
		console.log("sele",selectedValue)
		// frappeProject();
		// clearCalendar()
		// project_data();
        // job_data();
    } else if (selectedValue === "Employee") {
        // Fetch and populate employee data
        Employee();
    }
}

function project_data() {
    // Fetch project data and populate the calendarF
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Project",
            fields: ["name", "project_name", "expected_start_date", "expected_end_date"],
        },
        callback: function (r) {
            if (r.message && r.message.length > 0) {
                // Clear existing events from the calendar
                clearCalendar();

                for (var i = 0; i < r.message.length; i++) {
                    let resp_data = r.message[i];
                    let event = {
                        id: resp_data.name,
                        title: resp_data.project_name,
                        start: resp_data.expected_start_date,
                        end: resp_data.expected_end_date,
                        url: "http://127.0.0.1:8006/app/project/" + resp_data.name,
                        color: '#F5B411',
                        textColor: 'black'
                    };
                    events1.push(event);
                    console.log(event);
                }
                initializeCalendar(events1);
            }
        }
    });
}


function selected_project_onload() {
    let selectedProjects = Array.from(document.getElementById("project_select_for_all").selectedOptions).map(option => option.value);
    console.log(selectedProjects);
	

    // Reset events1 array for each selection change
    let events1 = [];

    selectedProjects.forEach(selectpro => {
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
                        id: resp_data.name,
                        title: resp_data.project_name,
                        start: resp_data.expected_start_date,
                        end: resp_data.expected_end_date,
                        url: "http://127.0.0.1:8006/app/project/" + resp_data.name,
                        color: '#FFAC33',
                        textColor: 'black'
                    };
                    events1.push(dt);
                }

                // Only initialize calendar once for all selected projects
                if (selectpro === selectedProjects[selectedProjects.length - 1]) {
                    initializeCalendar(events1);
                }
            }
        });
    });
}

function handleSelectChange() {
    // Call the first function
    frappeTask();

    // Call the second function
    select_job_data();

    // Get the selected value from the "View By" dropdown
    var viewByValue = document.getElementById("vehicle").value;

    // Check the selected value and conditionally call the employee_filter() function
    if (viewByValue !== "job") {
        employee_filter();
    }
}

function select_job_data() {
    let events1 = [];

    // Clear existing events from the calendar
    clearCalendar();

    // Fetch job data and populate the calendar
    let selectedProjects = Array.from(document.getElementById("project_select").selectedOptions).map(option => option.value);
    console.log(selectedProjects, "selectpro");

    selectedProjects.forEach(selectpro => {
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                // Add appropriate arguments for job data retrieval
                doctype: "Task",
                fields: ["*"],
                filters: {
                    project: selectpro,
                    parent_task: ""
                }
            },
            callback: function (r) {
                console.log("frappe.call callback executed", r);

                if (r.message && r.message.length > 0) {
                    let tsk_data = r.message;

                    tsk_data.forEach((data) => {
                        let dt1 = {
                            id: data.name,
                            title:  data.name + " - " + data.project,
                            start: data.exp_start_date,
                            end: data.exp_end_date,
                            url: "http://127.0.0.1:8006/app/task/" + data.name,
                            color: '#ADD918',
                            textColor: 'black'
                        };

                        events1.push(dt1);
                        console.log(events1)
                    });

                    if (selectpro === selectedProjects[selectedProjects.length - 1]) {
                        initializeCalendar(events1);
                    }
                }
            }
        });
    });
}

function all_emp_leave() {
    frappe.call({
        method: "hmws_scheduling.hmws_scheduling.page.calendar.booking_page.employee_leave_on_load",
        args: {},
        callback: function (r) {
            let data = r.message;
			console.log("dattatatttadatoi",data)
            let events1 = [];  // Declare events1 array outside the loop

            data.forEach((data) => {
                let dt1 = {
                    id: data.name,
                    title: data.employee + " - " + data.name,
                    start: data.from_date,
                    end: data.to_date,
                    url: "http://127.0.0.1:8006/app/task/" + data.name,
                    color: 'red',
                    textColor: 'black'
                };

                events1.push(dt1);
            });  // Remove the extra semicolon

            console.log(events1);
			initializeCalendar(events1);
            // show_calander();
        }
    });
}



function job_data() {
    // Fetch job data and populate the calendar
	
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            // Add appropriate arguments for job data retrieval
            doctype: "Task",
            fields: ["*"],
			filters: {
				// project: selectpro,
				parent_task: ""
			}
        },
        callback: function (r) {
            let tsk_data = r.message;
				console.log("revugdfrg",tsk_data);
                // Clear existing events from the calendar
                clearCalendar();

				tsk_data.forEach((data) => {
					let dt1 = {
						id:data.name,
						title: data.name + " - " + data.project,
						start: data.exp_start_date,
						end: data.exp_end_date,
						url: "http://127.0.0.1:8006/app/task/" + data.name,
						color: '#A8DB20',
						textColor: 'black'
					};

					events1.push(dt1);
					console.log(events1,"ebnldsnbfvbgsbaw")
				});
                initializeCalendar(events1);
            
        }
    });
}

function clearCalendar() {
    // Clear existing events from the calendar
    events1 = [];
    initializeCalendar(events1);
}


function alertmsg(){
	
		// Get the element by its ID
		console.log("DOM fully loaded and parsed");
		// var element = document.getElementById('fc-dom-24');
	
		// // Check if the element exists before adding the event listener
		// if (element) {
		//   // Add a click event listener
		//   element.addEventListener('click', function() {
		// 	// Show an alert when the element is clicked
		// 	alert('Element clicked!'); 
		//   });
		// }
	
}

// Add this function to handle the change in the "view By" dropdown
function handleFilterChange() {
    var viewBySelect = document.getElementById("vehicle");
    var projectField = document.getElementById("projectField");
    var jobField = document.getElementById("jobField");
    var employeeField = document.getElementById("employeeField");
	var projectField2=document.getElementById("projectField2")

    // Reset visibility for all fields
    projectField.style.display = "none";
    jobField.style.display = "none";
    employeeField.style.display = "none";
	projectField2.style.display = "none";
	

    // Show the selected field based on the "View By" option
    if (viewBySelect.value === "project") {
        projectField.style.display = "flex";
        // jobField.style.display = "flex"; // Show job field as well
        // Additional logic or functions related to the "project" option can be added here
		// project_data();
		// frappeProject();
        filter_project();
    } else if (viewBySelect.value === "job") {
        projectField2.style.display = "flex"; // Show project field as well
        jobField.style.display = "flex";
		job_data();
		
		// filter_project();
        // Additional logic or functions related to the "job" option can be added here
    } else if (viewBySelect.value === "employee") {
        projectField2.style.display = "flex";
        jobField.style.display = "flex";
        employeeField.style.display = "flex";
		select_emp();
		// all_emp_leave()
		// selected_employee_alll();
        // Additional logic or functions related to the "employee" option can be added here
    }
}

// Function to hide the additional fields initially
document.addEventListener("DOMContentLoaded", function () {
    var projectField = document.getElementById("projectField");
    var jobField = document.getElementById("jobField");
    var employeeField = document.getElementById("employeeField");

    projectField.style.display = "none";
	projectField2.style.display = "none";
    jobField.style.display = "none";
    employeeField.style.display = "none";
});


// Create a script element
var scriptselect = document.createElement('script');

// Set the src attribute to the jQuery CDN
scriptselect.src = 'https://code.jquery.com/jquery-3.6.4.min.js';

// Append the script element to the document's head
document.head.appendChild(scriptselect);

var scriptselect2 = document.createElement('script');

// Set the src attribute to the jQuery CDN
scriptselect2.src = "https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js";

// Append the script element to the document's head
document.head.appendChild(scriptselect2);





var script12 = document.createElement('script');

// Set the src attribute to the jQuery CDN
script12.src = 'https://code.jquery.com/jquery-3.6.4.min.js';

// Append the script element to the document's head
document.body.appendChild(script12);


var choosenjs= document.createElement('script')
choosenjs.src='https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js';
document.body.appendChild(choosenjs);



var choosencsss= document.createElement("link")
choosencsss.href='https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css';
document.head.appendChild(choosencsss);

    let script1 = document.createElement("script");
    script1.innerHTML = `
        // Your script content goes here
		
        
		

        ${frappeProject.toString()}
		${job_data.toString()}
		${select_job_data.toString()}
		${handleFilterChange.toString()}
		${selected_project.toString()}
		${handleSelectChange.toString()}
		${task_details.toString()}
		${clearCalendar.toString()}
		${employee_filter.toString()}
		${updateSubTaskField.toString()}
		${get_employee.toString()}
		${myfunc.toString()}
		${task_details_fielter.toString()}
		${select_emp.toString()}
		${selected_employee.toString()}
		${filter_project.toString()}
		${all_emp_leave.toString()}
		${project_data.toString()}
		${selected_project_onload.toString()}
		${alertmsg.toString()}
		${frappeTask.toString()}
		${frappeProject2.toString()}
		task_details();
		selected_project();
		frappeProject();
		frappeProject2();
		// all_emp_leave();
		${selected_employee.toString()}
		// selected_employee_alll();
		alertmsg();
		
		frappeTask();
		updateSubTaskField();
		get_employee();
		initializeCalendar();
		selected_project_onload()
		// project_data();
		// filter_project();

		$(document).ready(function () {
			var formVisible = false;
		
			$(".fc-daygrid-day-frame").dblclick(function (event) {
				var dateLabel = $(this).find(".fc-daygrid-day-top a").attr("aria-label");

		
				// You can use the dateLabel as needed, for example, display it in the console
				console.log("Clicked date: " + dateLabel);
		
				// Set the date in the form if needed
				$("#myForm input[name='date']").val(dateLabel);
		
				// Move the code to get selectTask inside the double-click event handler
				var selectTask = document.getElementById("task_select").value;
				console.log("selecttask of jquery", selectTask);
				$(selectTask).change(function () {
					var selectedTask = $(this).val();
		
					// If the selected task changes, clear the related inputs in the form
					if (selectedTask === "") {
						$("#myForm input[name='name']").val("");
						$("#myForm input[name='vihical']").val("");
						$("#myForm input[name='kit']").val("");
						$("#myForm input[name='job']").val("");
					}
				});
				if (selectTask) {
					// Call task_details_filter function
					frappe.call({
						method: "frappe.client.get_list",
						args: {
							doctype: "Task",
							fields: ["*"],
							filters: {
								name: selectTask
							}
						},
						callback: function (r) {
							let task_data = r.message;
							console.log(task_data, "");
							$("#myForm input[name='name']").val(task_data[0].project);
							$("#myForm input[name='vihical']").val(task_data[0].custom_vehicle);
							$("#myForm input[name='kit']").val(task_data[0].custom_kit);
							$("#myForm input[name='job']").val(task_data[0].name);
							// $("#myForm input[name='employee']").val(""); // You need to s
				
							
							
						}
					});
					console.log("hello")
				}
		
				// Set form position based on mouse coordinates
				var mouseX = event.pageX;
				var mouseY = event.pageY;
		
				// Adjust form position to center it on the mouse click
				var formWidth = $("#myForm").outerWidth();
				var formHeight = $("#myForm").outerHeight();
				var offsetX = 10; // Adjust as needed for better positioning
		
				// Set form position
				$("#myForm").css({
					top: mouseY - formHeight / 2,
					left: mouseX + offsetX,
					display: "block"
				});
		
				// Update the flag to indicate that the form is now visible
				formVisible = true;
		
				// Prevent the click event from propagating to the document click handler
				event.stopPropagation();
			});
		
			// Add a click event to the document to hide the form when clicking outside it
			$(document).dblclick(function () {
				if (formVisible) {
					// Hide the form
					$("#myForm").hide();
		
					// Update the flag to indicate that the form is now hidden
					formVisible = false;
				}
			});
		});
		
		$(document).ready(function() {
			// Function to update date value and close the form
			function updateDateAndCloseForm(dateLabel) {
				$("#myForm input[name='date']").val(dateLabel);
				$("#myForm").hide();
			}
	
			// Event listener for close button
			$("#closeForm").click(function() {
				$("#myForm").hide();
			});
	
			// Assuming you have a function to get the date label
			var dateLabel = getDateLabel(); // You need to define this function
	
			// Call the function to update date value and close the form
			updateDateAndCloseForm(dateLabel);
		});
		

		// Check if jQuery is loaded
		// Check if jQuery is loaded
		$(document).ready(function() {
			console.log("Document ready function fired.");
		
			// Initialize Select2 for the select field with ID "project_select_Booking"
			$('#project_select_Booking').select2({
				theme: 'bootstrap4', // Optionally, specify the theme
				placeholder: "",
				allowClear: true, // Optionally, specify a placeholder
			});
		
			// Show the search field when the dropdown is opened
			$('.select2-container--bootstrap4').on('click', function() {
				$('.select2-search').css('display', 'block');
			});
		
			// Add event listener to apply styles when selection rendered is clicked
			$('.select2-selection__rendered').on('click', function() {
				$(this).addClass('clicked');
			});
		
			// Add class after two seconds
			$('#project_select_Booking').on('select2:open', function () {
				setTimeout(function() {
					$('.select2-selection__rendered').addClass('delayed');
				}, 125); // 2000 milliseconds = 2 seconds
			});
		
			// Add event listener for change event
			$('#project_select_Booking').on('change', function() {
				// Check if the value is empty (option removed)
				if (!$(this).val()) {
					// Remove the 'clicked' class
					$('.select2-selection__rendered').removeClass('clicked');
					// Call your function here
					selected_project();
				}
			});
		});

		$(document).ready(function() {
			console.log("Document ready function fired.");
	
			// Initialize Select2 for the select field with ID "task"
			$('#task').select2({
				theme: 'bootstrap4', // Optionally, specify the theme
				placeholder: "",
				allowClear: true, // Optionally, specify a placeholder
			});
	
			// Show the search field when the dropdown is opened
			// $('.select2-container--bootstrap4').on('click', function() {
			// 	$('.select2-search').css('display', 'block');
			// });
	
			// Add event listener to apply styles when selection rendered is clicked
			$('.select2-selection__rendered').on('click', function() {
				$(this).addClass('clicked');
			});
	
			// Add class after two seconds
			$('#task').on('select2:open', function () { // Corrected the event name
				setTimeout(function() {
					$('.select2-selection__rendered').addClass('delayed');
				}, 125); // 2000 milliseconds = 2 seconds
			});
	
			// Add event listener for change event
			$('#task').on('change', function() { // Corrected the ID used
				// Check if the value is empty (option removed)
				if (!$(this).val()) {
					// Remove the 'clicked' class
					$('.select2-selection__rendered').removeClass('clicked');
					// Call your function here
					task_details(); // Assuming task_details() is a defined function
				}
			});
		});


		$(document).ready(function() {
			console.log("Document ready function fired.");
	
			// Initialize Select2 for the select field with ID "task"
			$('#vehical').select2({
				theme: 'bootstrap4', // Optionally, specify the theme
				placeholder: "",
				allowClear: true, // Optionally, specify a placeholder
			});
	
			// Show the search field when the dropdown is opened
			// $('.select2-container--bootstrap4').on('click', function() {
			// 	$('.select2-search').css('display', 'block');
			// });
	
			// Add event listener to apply styles when selection rendered is clicked
			$('.select2-selection__rendered').on('click', function() {
				$(this).addClass('clicked');
			});
	
			// Add class after two seconds
			$('#task').on('select2:open', function () { // Corrected the event name
				setTimeout(function() {
					$('.select2-selection__rendered').addClass('delayed');
				}, 125); // 2000 milliseconds = 2 seconds
			});
	
			// Add event listener for change event
			$('#task').on('change', function() { // Corrected the ID used
				// Check if the value is empty (option removed)
				if (!$(this).val()) {
					// Remove the 'clicked' class
					$('.select2-selection__rendered').removeClass('clicked');
					// Call your function here
					task_details(); // Assuming task_details() is a defined function
				}
			});
		});
		

		$(document).ready(function() {
			console.log("Document ready function fired.");
	
			// Initialize Select2 for the select field with ID "task"
			$('#kit').select2({
				theme: 'bootstrap4', // Optionally, specify the theme
				placeholder: "",
				allowClear: true, // Optionally, specify a placeholder
			});
	
			// Show the search field when the dropdown is opened
			// $('.select2-container--bootstrap4').on('click', function() {
			// 	$('.select2-search').css('display', 'block');
			// });
	
			// Add event listener to apply styles when selection rendered is clicked
			$('.select2-selection__rendered').on('click', function() {
				$(this).addClass('clicked');
			});
	
			// Add class after two seconds
			$('#task').on('select2:open', function () { // Corrected the event name
				setTimeout(function() {
					$('.select2-selection__rendered').addClass('delayed');
				}, 125); // 2000 milliseconds = 2 seconds
			});
	
			// Add event listener for change event
			$('#task').on('change', function() { // Corrected the ID used
				// Check if the value is empty (option removed)
				if (!$(this).val()) {
					// Remove the 'clicked' class
					$('.select2-selection__rendered').removeClass('clicked');
					// Call your function here
					task_details(); // Assuming task_details() is a defined function
				}
			});
		});


		$(document).ready(function() {
			console.log("Document ready function fired.");
	
			// Initialize Select2 for the select field with ID "task"
			$('#sub_task').select2({
				theme: 'bootstrap4', // Optionally, specify the theme
				placeholder: "",
				allowClear: true, // Optionally, specify a placeholder
			});
	
			// Show the search field when the dropdown is opened
			// $('.select2-container--bootstrap4').on('click', function() {
			// 	$('.select2-search').css('display', 'block');
			// });
	
			// Add event listener to apply styles when selection rendered is clicked
			$('.select2-selection__rendered').on('click', function() {
				$(this).addClass('clicked');
			});
	
			// Add class after two seconds
			$('#task').on('select2:open', function () { // Corrected the event name
				setTimeout(function() {
					$('.select2-selection__rendered').addClass('delayed');
				}, 125); // 2000 milliseconds = 2 seconds
			});
	
			// Add event listener for change event
			$('#task').on('change', function() { // Corrected the ID used
				// Check if the value is empty (option removed)
				if (!$(this).val()) {
					// Remove the 'clicked' class
					$('.select2-selection__rendered').removeClass('clicked');
					// Call your function here
					task_details(); // Assuming task_details() is a defined function
				}
			});
		});


		$(document).ready(function() {
			console.log("Document ready function fired.");
	
			// Initialize Select2 for the select field with ID "task"
			$('#job_role').select2({
				theme: 'bootstrap4', // Optionally, specify the theme
				placeholder: "",
				allowClear: true, // Optionally, specify a placeholder
			});
	
			// Show the search field when the dropdown is opened
			// $('.select2-container--bootstrap4').on('click', function() {
			// 	$('.select2-search').css('display', 'block');
			// });
	
			// Add event listener to apply styles when selection rendered is clicked
			$('.select2-selection__rendered').on('click', function() {
				$(this).addClass('clicked');
			});
	
			// Add class after two seconds
			$('#task').on('select2:open', function () { // Corrected the event name
				setTimeout(function() {
					$('.select2-selection__rendered').addClass('delayed');
				}, 125); // 2000 milliseconds = 2 seconds
			});
	
			// Add event listener for change event
			$('#task').on('change', function() { // Corrected the ID used
				// Check if the value is empty (option removed)
				if (!$(this).val()) {
					// Remove the 'clicked' class
					$('.select2-selection__rendered').removeClass('clicked');
					// Call your function here
					task_details(); // Assuming task_details() is a defined function
				}
			});
		});
		

		
		$(document).ready(function() {
			console.log("Document ready function fired.");
	
			// Initialize Select2 for the select field with ID "task"
			$('#employee_select').select2({
				theme: 'bootstrap4', // Optionally, specify the theme
				placeholder: "",
				allowClear: true, // Optionally, specify a placeholder
			});
	
			// Show the search field when the dropdown is opened
			// $('.select2-container--bootstrap4').on('click', function() {
			// 	$('.select2-search').css('display', 'block');
			// });
	
			// Add event listener to apply styles when selection rendered is clicked
			$('.select2-selection__rendered').on('click', function() {
				$(this).addClass('clicked');
			});
	
			// Add class after two seconds
			$('#task').on('select2:open', function () { // Corrected the event name
				setTimeout(function() {
					$('.select2-selection__rendered').addClass('delayed');
				}, 125); // 2000 milliseconds = 2 seconds
			});
	
			// Add event listener for change event
			$('#task').on('change', function() { // Corrected the ID used
				// Check if the value is empty (option removed)
				if (!$(this).val()) {
					// Remove the 'clicked' class
					$('.select2-selection__rendered').removeClass('clicked');
					// Call your function here
					task_details(); // Assuming task_details() is a defined function
				}
			});
		});
		
		
		

		
		
		`;

    setTimeout(() => {
        document.body.appendChild(script1);
    }, 2000);

    setTimeout(() => {
        $(frappe.render_template("booking_page", {})).appendTo(page.body);
    }, 1000);
	
	
}


