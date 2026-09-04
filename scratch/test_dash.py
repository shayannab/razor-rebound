import urllib.request, json

r = urllib.request.urlopen('http://127.0.0.1:8000/api/dashboard_data')
data = json.loads(r.read())
events = data.get('events', [])
print('Total events returned:', len(events))
for ev in events:
    amt = ev.get('amount_paise', 0) / 100
    conf = ev.get('confirmed_amount_paise', 0) / 100
    print(f"ID: {ev.get('event_id')} | Action: {ev.get('action'):18} | Amount: Rs.{amt:6.2f} | Confirmed: Rs.{conf:6.2f} | Link: {ev.get('link')}")
