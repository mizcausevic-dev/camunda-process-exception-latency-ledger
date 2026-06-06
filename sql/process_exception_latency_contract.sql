-- Board-readable Camunda process exception latency contract.
-- Replace example schema names with warehouse tables that mirror Camunda incident,
-- task, and process-instance export data.
select
  process_key,
  count(*) filter (where incident_state = 'open') as active_incidents,
  count(*) filter (where task_due_at < current_timestamp and task_state <> 'completed') as overdue_human_tasks,
  count(*) filter (where retry_count > 2) as retry_loop_count,
  avg(extract(epoch from decision_closed_at - decision_opened_at) / 3600.0) as avg_decision_latency_hours,
  100.0 * count(*) filter (where sla_breached) / nullif(count(*), 0) as sla_breach_rate_percent,
  count(*) filter (where escalation_state = 'unresolved') as unresolved_escalations
from ops.camunda_process_exception_events
where observed_at >= current_date - interval '30 day'
group by process_key;
