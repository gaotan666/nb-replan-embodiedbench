# NB-Replan · EmbodiedBench Results

A minimal static showcase with two academic three-line comparison tables and six real step-by-step simulation replays, three each for EB-ALFRED and EB-Habitat.

- EB-ALFRED: 244/300 (81.3%) on the local public 300-task set.
- EB-Habitat: 288/300 (96.0%) on the local public 300-task set.

Official reference numbers come from the [EmbodiedBench project](https://embodiedbench.github.io/). Our constraint libraries were iterated using failures from these public tasks. These results are not an official blind leaderboard submission.

The replay uses one actual observation frame per environment action. The short fade improves viewing but does not invent intermediate simulator frames.

The repository contains display assets only: no model weights, full constraint library, training data, or simulator assets. Source details are in `data_sources.json`. For GitHub Pages, publish this repository from the root directory.
