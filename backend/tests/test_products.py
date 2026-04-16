"""Tests for products endpoints."""


class TestListProducts:
    def test_list_products_empty(self, client):
        res = client.get("/api/products")
        assert res.status_code == 200
        data = res.json()
        assert data["items"] == []
        assert data["total"] == 0

    def test_list_products_with_pagination(self, client):
        res = client.get("/api/products?limit=10&offset=0")
        assert res.status_code == 200
        data = res.json()
        assert "items" in data
        assert "total" in data
        assert data["limit"] == 10
        assert data["offset"] == 0

    def test_list_products_invalid_limit(self, client):
        res = client.get("/api/products?limit=0")
        assert res.status_code == 422

    def test_list_products_invalid_offset(self, client):
        res = client.get("/api/products?offset=-1")
        assert res.status_code == 422
