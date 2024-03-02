import frappe
from datetime import datetime

@frappe.whitelist()
def get_sub_task(task):
    task_data=frappe.db.sql("select task,custom_job_role,custom_employee from `tabTask Depends On` where parent=%s",task,as_dict=True)
    job_role_list=[]
    emplyoee_list=[]
    task_list=[]
    for i in task_data:
        job_role_list.append(i["custom_job_role"])
        emplyoee_list.append(i["custom_employee"])
        task_list.append(i["task"])
    return job_role_list,emplyoee_list,task_list

@frappe.whitelist()
def get_emp_list(job_role):
    print("Received job role:", job_role)  # Add this line for debugging
    get_emp = frappe.db.sql("select name from `tabEmployee` where designation=%s", job_role, as_dict=True)
    emp_list = [i["name"] for i in get_emp]
    print("Employee list:", emp_list)  # Add this line for debugging
    return emp_list


@frappe.whitelist()
def employee_leave(emp_id,s_dt,e_dt):
    s_dt1 = datetime.strptime(s_dt, "%Y-%m-%d").date()
    e_dt1 = datetime.strptime(e_dt,"%Y-%m-%d").date()
    get_leave = frappe.db.sql("""SELECT name, employee, from_date, to_date 
    FROM `tabLeave Application` 
    WHERE employee = %s 
    AND from_date <= %s 
    AND to_date >= %s
""", (emp_id, e_dt1, s_dt1), as_dict=True)
    leave_list=[]
    start_date=[]
    end_date=[]
    aa=[]
    for i in get_leave:
        leave_list.append(i["name"])
        start_date.append(i["from_date"])
        end_date.append(i["to_date"])
    return {"leave_id":leave_list,"start_date":start_date,"end_date":end_date}


@frappe.whitelist()
def employee_booking(emp_id,s_dt,e_dt):
    s_dt1 = datetime.strptime(s_dt, "%Y-%m-%d").date()
    e_dt1 = datetime.strptime(e_dt,"%Y-%m-%d").date()
    get_leave = frappe.db.sql("""SELECT name, employee, start_date, end_date 
    FROM `tabBooking` 
    WHERE employee = %s 
    AND start_date <= %s 
    AND end_date >= %s
""", (emp_id, e_dt1, s_dt1), as_dict=True)
    leave_list=[]
    start_date=[]
    end_date=[]
    aa=[]
    for i in get_leave:
        leave_list.append(i["name"])
        start_date.append(i["start_date"])
        end_date.append(i["end_date"])
    return {"book_id":leave_list,"start_date":start_date,"end_date":end_date}


@frappe.whitelist()
def get_expiry_data(emp_id, s_dt, e_dt):
    s_dt1 = datetime.strptime(s_dt, "%Y-%m-%d").date()
    e_dt1 = datetime.strptime(e_dt, "%Y-%m-%d").date()

    get_leave = frappe.db.sql("""
        SELECT expiry_date, document_name 
        FROM `tabCompliance Checklist` 
        WHERE parent=%s AND expiry_date BETWEEN %s AND %s
    """, (emp_id, s_dt1, e_dt1), as_dict=True)
    # print("aihsdfhoiasfiffh",get_leave)

    leave_list = []
    expiry_date = []

    for i in get_leave:
        leave_list.append(i["document_name"])
        expiry_date.append(i["expiry_date"])

    return {"document_names": leave_list, "expiry_dates": expiry_date}



@frappe.whitelist()
def get_certificate(emp_id, task,end_date,start_date):
    # Your existing code here...
    
    get_leave = frappe.db.sql("""
        SELECT ec.checklist, e.name
        FROM tabTask e
        JOIN `tabChecklist` ec ON e.name = ec.parent
        WHERE e.name = %s
    """, (task), as_dict=True)

    leave_list = []
    employee_names_task = []  # Rename to employee_names_task to avoid conflicts
    
    for i in get_leave:
        checklist_value = i["checklist"]
        if checklist_value:
            employee_names_task.append(i["name"])
            leave_list.append(checklist_value)
        else:
            leave_list.append(f"No Compliance Checklist for Task {task}")

    get_leave2 = frappe.db.sql("""
        SELECT ec.document_name, e.name
        FROM tabEmployee e
        JOIN `tabCompliance Checklist` ec ON e.name = ec.parent
        WHERE e.name = %s 
    """, (emp_id), as_dict=True)

    leave_list2 = []
    employee_names_emp = []  # Rename to employee_names_emp to avoid conflicts
    
    for i in get_leave2:
        checklist_value_emp = i["document_name"]
        if checklist_value_emp:
            employee_names_emp.append(i["name"])
            leave_list2.append(checklist_value_emp)
        else:
            leave_list2.append(f"No Compliance Checklist for Employee {emp_id}")

    # Use set difference to find values in leave_list but not in leave_list2
    differences = set(leave_list) - set(leave_list2)
    print(differences)

    return {"employee_names_emp": employee_names_emp, "differences": list(differences)}




@frappe.whitelist()
def get_certificate(emp_id, task,end_date,start_date):
    # Your existing code here...
    
    get_leave = frappe.db.sql("""
        SELECT ec.checklist, e.name
        FROM tabTask e
        JOIN `tabChecklist` ec ON e.name = ec.parent
        WHERE e.name = %s
    """, (task), as_dict=True)

    leave_list = []
    employee_names_task = []  # Rename to employee_names_task to avoid conflicts
    
    for i in get_leave:
        checklist_value = i["checklist"]
        if checklist_value:
            employee_names_task.append(i["name"])
            leave_list.append(checklist_value)
        else:
            leave_list.append(f"No Compliance Checklist for Task {task}")

    get_leave2 = frappe.db.sql("""
        SELECT ec.document_name, e.name
        FROM tabEmployee e
        JOIN `tabCompliance Checklist` ec ON e.name = ec.parent
        WHERE e.name = %s 
    """, (emp_id), as_dict=True)

    leave_list2 = []
    employee_names_emp = []  # Rename to employee_names_emp to avoid conflicts
    
    for i in get_leave2:
        checklist_value_emp = i["document_name"]
        if checklist_value_emp:
            employee_names_emp.append(i["name"])
            leave_list2.append(checklist_value_emp)
        else:
            leave_list2.append(f"No Compliance Checklist for Employee {emp_id}")

    # Use set difference to find values in leave_list but not in leave_list2
    differences = set(leave_list) - set(leave_list2)
    print(differences)

    return {"employee_names_emp": employee_names_emp, "differences": list(differences)}




@frappe.whitelist()
def change_task_date(event_id,start_date,end_date):
   tsk=frappe.get_doc("Task",event_id)
   tsk.exp_start_date=start_date
   tsk.exp_end_date=end_date
   tsk.save()
   frappe.db.commit()


   
# @frappe.whitelist()
# def change_project_date(event_id, start_date, end_date):
#     # Assuming Project is the doctype you are working with
#     pro = frappe.get_doc("Project", event_id)

#     # Update the start_date and end_date fields
#     pro.expected_start_date = start_date
#     pro.expected_end_date = end_date

#     # Save the changes to the database
#     pro.save()
#     frappe.db.commit()

#     # Get the names of tasks linked to this project
#     task_names = frappe.get_list("Task", filters={"project": event_id}, fields=["name"])

#     # Sort task_names in ascending order
#     task_names_sorted = sorted(task_names, key=lambda x: x['name'])
#     if task_names_sorted:
#         last_task_name = task_names_sorted[-1].get("name")
#         last_task = frappe.get_doc("Task", last_task_name)
#         last_task.exp_end_date = end_date
#         last_task.save()
#         frappe.db.commit()
#         print(f"Updated exp_end_date of the last task ({last_task.name}) to {end_date}")
#     else:
#         print("There are no tasks linked to the project.")

#     print(task_names_sorted)
# @frappe.whitelist()
# def change_project_date(event_id, start_date, end_date):
#     # Assuming Project is the doctype you are working with
#     pro = frappe.get_doc("Project", event_id)

#     # Update the start_date and end_date fields
#     pro.expected_start_date = start_date
#     pro.expected_end_date = end_date

#     # Save the changes to the database
#     pro.save()
#     frappe.db.commit()

#     # Get the names of tasks linked to this project
#     task_names = frappe.get_list("Task", filters={"project": event_id}, fields=["name"])

#     # Sort task_names in ascending order
#     task_names_sorted = sorted(task_names, key=lambda x: x['name'])
#     if task_names_sorted:
#         for task_name in task_names_sorted:
#             task = frappe.get_doc("Task", task_name["name"])
#             task.srint(f"Updated exp_end_date of task ({task.name}) to {end_date}")
#     else:
#         print("There are no tasks linked to the project.")

#     # Get the employees assigned to tasks
#     task_names = frappe.get_list("Task", filters={"project": event_id}, fields=["name"])
#     task_names_list = [task["name"] for task in task_names]
#     employees_assigned = frappe.get_all("Task Depends On", filters={"parent": ["in", task_names_list]}, fields=["custom_employee"])

#     for employee in employees_assigned:
#         emp_id = employee.get("custom_employee")
        
#         # Check if the employee's certificate is expired during the project period
#         if get_expiry_data(emp_id, end_date):
#             certificate_expired_message = f"Employee {emp_id}'s certificate is expired during the project period."
#             frappe.msgprint(certificate_expired_message)
#             return

#         leave_info = employee_leave(emp_id, start_date, end_date)

#         if leave_info["leave_id"]:
#             leave_message = f"Employee {emp_id} is on leave during the project period. Leave ID(s): {', '.join(leave_info['leave_id'])}"
#             frappe.msgprint(leave_message)
#             return
@frappe.whitelist()
def get_certificate_project(emp_id, task,end_date,start_date):
    # Your existing code here...
    
    get_leave = frappe.db.sql("""
        SELECT ec.checklist, e.name
        FROM tabTask e
        JOIN `tabChecklist` ec ON e.name = ec.parent
        WHERE e.name = %s
    """, (task), as_dict=True)

    leave_list = []
    employee_names_task = []  # Rename to employee_names_task to avoid conflicts
    
    for i in get_leave:
        checklist_value = i["checklist"]
        if checklist_value:
            employee_names_task.append(i["name"])
            leave_list.append(checklist_value)
        else:
            leave_list.append(f"No Compliance Checklist for Task {task}")

    get_leave2 = frappe.db.sql("""
        SELECT ec.document_name, e.name
        FROM tabEmployee e
        JOIN `tabCompliance Checklist` ec ON e.name = ec.parent
        WHERE e.name = %s 
    """, (emp_id), as_dict=True)

    leave_list2 = []
    employee_names_emp = []  # Rename to employee_names_emp to avoid conflicts
    
    for i in get_leave2:
        checklist_value_emp = i["document_name"]
        if checklist_value_emp:
            employee_names_emp.append(i["name"])
            leave_list2.append(checklist_value_emp)
        else:
            leave_list2.append(f"No Compliance Checklist for Employee {emp_id}")

    # Use set difference to find values in leave_list but not in leave_list2
    differences = set(leave_list) - set(leave_list2)
    print(differences)

    return {"employee_names_emp": employee_names_emp, "differences": list(differences)}



@frappe.whitelist()
def change_project_date(event_id, start_date, end_date):
    # Assuming Project is the doctype you are working with
    pro = frappe.get_doc("Project", event_id)

    # Update the start_date and end_date fields
    pro.expected_start_date = start_date
    pro.expected_end_date = end_date

    # Save the changes to the database
    pro.save()
    frappe.db.commit()

    # Get the names of tasks linked to this project
    task_names = frappe.get_list("Task", filters={"project": event_id}, fields=["name"])

    # Sort task_names in ascending order
    task_names_sorted = sorted(task_names, key=lambda x: x['name'])
    if task_names_sorted:
    # Get the last task in the sorted list
        last_task_name = task_names_sorted[-1]["name"]
        last_task = frappe.get_doc("Task", last_task_name)

        # Update exp_end_date of the last task
        last_task.exp_end_date = end_date
        last_task.save()
        frappe.db.commit()
        print(f"Updated exp_end_date of task ({last_task.name}) to {end_date}")
    else:
        print("There are no tasks linked to the project.")

    # Get the employees assigned to tasks
    task_names = frappe.get_list("Task", filters={"project": event_id}, fields=["name"])

    task_names_list = [task["name"] for task in task_names]
    print("tasks", task_names_list)

    employees_assigned = frappe.get_all("Task Depends On", filters={"parent": ["in", task_names_list]}, fields=["custom_employee", "task"], distinct=True)

    print("employees_assigned", employees_assigned)
    for employee in employees_assigned:
        emp_id = employee.get("custom_employee")
        task_name = employee.get("task")
        print(emp_id)
        differences_messages = []
        booking_info = employee_booking(emp_id, start_date, end_date)
        if booking_info["book_id"]:
            booking_message = f"Employee {emp_id} is already booked during the project period. Booking ID(s): {', '.join(booking_info['book_id'])}"
            frappe.msgprint(booking_message)
        # Check for compliance checklist differences when the date increases
        if end_date > start_date:
            certificate_data = get_certificate_project(emp_id, task_name, end_date, start_date)
            # print("hello", certificate_data)
            differences = set(certificate_data.get("employee_names_task", [])) - set(certificate_data.get("employee_names_emp", []))
            # Check if there are differences in compliance checklists
            if certificate_data["differences"]:
                for difference in certificate_data["differences"]:
                    differences_message = f"Employee {emp_id} has no certificate: {difference}."
                    differences_messages.append(differences_message)

                # Optionally, you can print or use certificate_data["employee_names_emp"] for more details
                # print("Employee Names with Differences:", certificate_data["employee_names_emp"])

        for msg in differences_messages:
            frappe.msgprint(msg)       # frappe.msgprint(differences_message)

            # Check for document expiry differences
        expiry_data = get_expiry_data(emp_id, start_date, end_date)

            # Use set difference to find differences between two lists
        expiry_differences = set([str(date) for date in expiry_data["expiry_dates"]]) - set(certificate_data["differences"])

        if expiry_differences:
                expiry_message = f"Employee {emp_id} has documents expiring during the project period. Expiry Dates: {', '.join(expiry_differences)}"
                frappe.msgprint(expiry_message)

        leave_info = employee_leave(emp_id, start_date, end_date)
        
        

        if leave_info["leave_id"]:
            leave_message = f"Employee {emp_id} is on leave during the project period. Leave ID(s): {', '.join(leave_info['leave_id'])}"
            print(leave_message)
            frappe.msgprint(leave_message)

    # Print only the last task name if there are tasks
    # if task_names:
    #     last_task_name = task_names[-1].get("name")
    #     print("Last Task name linked to the project:", last_task_name)
    # else:
    #     print("No tasks linked to the project.")

