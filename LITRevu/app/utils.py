import random

def generate_random_numbers(count=10, start=0, end=10):
    """Generate an array of random numbers for class rendering purpose.

    Args:
        count (int): The number of random numbers to generate.
        start (int): The lower bound of the random number range (inclusive).
        end (int): The upper bound of the random number range (inclusive).

    Returns:
        list: A list of random numbers.
    """
    return [random.randint(start, end) for _ in range(count)]
