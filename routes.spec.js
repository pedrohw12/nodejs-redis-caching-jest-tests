const axios = require("axios");

describe("Routes", () => {
  it("Should return an array of result if provided correct api_key", async () => {
    const { data } = await axios.get("http://localhost:3000/photos", {
      headers: { api_key: "123" },
    });
    const expected = [
      {
        albumId: 1,
        id: 1,
        title: "accusamus beatae ad facilis cum similique qui sunt",
        url: "https://via.placeholder.com/600/92c952",
        thumbnailUrl: "https://via.placeholder.com/150/92c952",
      },
    ];

    expect(data.results).toEqual(expect.arrayContaining(expected));
  });

  it("Should return cached results", async () => {
    const { data } = await axios.get("http://localhost:3000/photos", {
      headers: { api_key: "123" },
    });

    expect(data.isCached).toBe(true);
  });

  it("Should throw unauthorized_access if provide wrong api_key", async () => {
    const { data } = await axios.get("http://localhost:3000/photos", {
      headers: { api_key: "1234" },
    });

    expect(data).toEqual("unauthorized_access");
  });
});
