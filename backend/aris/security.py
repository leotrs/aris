"""Password hashing and verification utilities using bcrypt."""

import bcrypt


def hash_password(password: str) -> str:
    """Hash a plaintext password using bcrypt with salt.

    Parameters
    ----------
    password : str
        The plaintext password to hash.

    Returns
    -------
    str
        The bcrypt hashed password as a UTF-8 encoded string.

    Notes
    -----
    Uses bcrypt.gensalt() to generate a random salt for each password,
    ensuring that identical passwords produce different hashes.
    """
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    """Verify a plaintext password against a bcrypt hash.

    Parameters
    ----------
    password : str
        The plaintext password to verify.
    hashed : str
        The bcrypt hashed password to compare against.

    Returns
    -------
    bool
        True if the password matches the hash, False otherwise.

    Notes
    -----
    This function is safe against timing attacks as bcrypt.checkpw()
    performs constant-time comparison.
    """
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
