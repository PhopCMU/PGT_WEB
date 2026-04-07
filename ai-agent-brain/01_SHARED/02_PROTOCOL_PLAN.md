# วางแผน + เลือก agent
# Protocol: Planning (PLAN v2)

## Purpose
Convert confirmed AC into a small, low-risk plan and pick implementer agent.

## Plan constraints
- <= 8 steps
- list files to touch (predicted)
- specify test approach (unit/integration/manual)

## Plan output
1) Confirmed AC
2) Design notes (short)
3) File list (predicted)
4) Step plan
5) Test plan
6) Hand-off: “Proceed with agent: <agent file>”

## Risk rules
- Prefer additive change.
- Avoid breaking API/data changes without migration plan.