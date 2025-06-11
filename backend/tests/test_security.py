import pytest

from aris.security import hash_password, verify_password


def test_hash_and_verify_password():
    password = "mysecret"
    hashed = hash_password(password)
    assert isinstance(hashed, str)
    assert hashed != password
    assert verify_password(password, hashed)
    assert not verify_password("wrong", hashed)


def test_hash_password_unique_salt():
    p = "password"
    h1 = hash_password(p)
    h2 = hash_password(p)
    # Each hash should use a new salt
    assert h1 != h2