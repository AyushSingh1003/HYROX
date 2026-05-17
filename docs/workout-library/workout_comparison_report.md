# Workout Comparison Report

## Internal Library Summary

- Internal fixed program workouts reviewed: 77
- Internal workouts with full support fields: 60
- Workouts needing explicit progression metadata: 6
- Workouts needing improvement: 11

## Public Source Patterns Mapped

| Pattern | Public Source Signal | Library Response |
| --- | --- | --- |
| Zone 2 running | Easy 5 km, 5-8 km, long runs | Added Zone 2 builder and long run reset sessions |
| 1 km repeats | Repeated 1 km run intervals | Added 1K Repeat Pace Lock |
| Beginner bricks | Run + station + run progressions | Added Run Erg Brick Ladder and Four-Station Primer |
| Sled overload | Sled EMOMs and progressive load | Added Sled Push Pull Overload |
| Wall-ball accumulation | Weekly volume/EMOM concepts | Added Wall Ball Capacity EMOM |
| Full simulation | Week 11/full or 90% simulation | Added Controlled Full HYROX Simulation |
| Taper primer | Light stations and strides | Added Race Week Station Primer |

## Validation Labels

- validated: usable internal workout with complete support fields.
- needs_improvement: missing core coaching fields or insufficient prescription detail.
- replace: should be superseded by upgraded library item.
- missing_progression: good session but not yet connected to an explicit 4-week progression.
- new_workout_candidate: new addition recommended by gap analysis.

## Production Recommendation

Use upgraded_hyrox_workout_library.json as the canonical workout browser seed. Keep validated_workouts.json as a migration/comparison layer for existing plans. Add Endur-derived workouts only after user-provided assets are normalized and rewritten.
