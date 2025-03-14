from aris import ENGINE
from aris.models import Base


def main():
    """Create the tables."""
    Base.metadata.create_all(ENGINE)
    print("Tables created successfully!")


if __name__ == "__main__":
    main()
