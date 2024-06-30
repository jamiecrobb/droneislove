from __future__ import annotations
from pathlib import Path
import numpy as np
from numpy.typing import NDArray
from scipy.stats import norm


class LocalisationModel:
    def __init__(self, m: float, c: float, sigma: float) -> None:
        self._m = m
        self._c = c
        self._sigma = sigma

    @staticmethod
    def from_file(filename: str) -> LocalisationModel:
        path = Path(filename)
        assert path.exists() and path.is_file(), "Invalid file."
        with open(path, 'r', encoding="utf-8") as f:
            lines = [l.strip().split(",") for l in f.readlines()]
        assert len(
            lines) == 3, "Expected file with two lines, each with format 'dist, volume'."
        assert all(len(
            x) == 2 for x in lines[:2]), "Expected file with two lines, each with format 'dist, volume'."
        assert len(
            lines[2]) == 1, "Expected final line to contain a single value for sigma."
        pt1 = np.array(list(map(float, lines[0])))
        pt2 = np.array(list(map(float, lines[1])))
        gradient = (pt2[1] - pt1[1]) / (pt2[0] - pt1[0])
        y_int = pt1[1] - gradient * pt1[0]
        sigma = float(lines[2][0])
        return LocalisationModel(gradient, y_int, sigma)

    def infer(self, distance: float) -> float:
        return max(0, np.pow(10, np.log10(distance) * self._m + self._c))

    def likelihood(self, expected_volume, observed_volume) -> float:
        coefficient = 1 / np.sqrt(2 * np.pi * self._sigma**2)
        # Calculate the exponent
        exponent = -((observed_volume - expected_volume)**2) / \
            (2 * self._sigma**2)
        # Calculate the PDF value]
        pdf_value = coefficient * np.exp(exponent)
        return pdf_value


class Localiser:
    def __init__(self, n_samples: int, model: LocalisationModel) -> None:
        self._model = model
        self._n_samples = n_samples

    def localise(self, observations: list[float], positions: list[tuple[float, float]]) -> NDArray[np.float32]:
        if len(observations) == 0 or len(positions) == 0:
            return np.array([0.0, 0.0])
        # determine the boundaries of the sample space
        minX = min(map(lambda x: x[0], positions))
        maxX = max(map(lambda x: x[0], positions))
        minY = min(map(lambda x: x[1], positions))
        maxY = max(map(lambda x: x[1], positions))
        xRange = maxX - minX
        yRange = maxY - minY
        likelihoods = []
        samples = []
        # generate samples
        for i in range(self._n_samples):
            sample = np.random.random((2,)) * (xRange, yRange) + (minX, minY)
            samples.append(sample)
            # determine sample likelihood
            likelihood = 0.0
            for pos, obs in zip(positions, observations):
                distance = np.sqrt(np.sum(np.square(sample - pos)))
                expected_volume = self._model.infer(distance)
                likelihood += np.log(self._model.likelihood(expected_volume, obs))
            likelihoods.append(likelihood)
        maximum_likelihood = np.argmax(likelihoods)
        return samples[maximum_likelihood]
