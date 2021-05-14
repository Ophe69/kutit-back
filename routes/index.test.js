var app = require("../app")
var request = require("supertest")


test("Réservation coiffeur - Body correct", async (done) => {
    await request(app).post('/search')
      .send({ latitude: '1234', longitude: '1322', barberShop: false, date: 'december' })
      .expect(200)
      .expect({ result: true });
    done();
});

test("Réservation coiffeur - Body incomplet", async (done) => {
    await request(app).post('/search')
      .send({ latitude: '1234', longitude: '1322', barberShop: false })
      .expect(200)
      .expect({ result: false });
    done();
});

   