from backend.models.workflow import AutomationAction


def list_automations() -> list[AutomationAction]:
    return [
        AutomationAction(id="send_email", label="Send Email", params=["to", "subject"]),
        AutomationAction(id="generate_doc", label="Generate Document", params=["template", "recipient"]),
        AutomationAction(id="create_ticket", label="Create IT Ticket", params=["system", "priority"]),
        AutomationAction(id="update_hris", label="Update HRIS Record", params=["employee_id", "field"]),
    ]
