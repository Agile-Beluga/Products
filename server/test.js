const assert = require('assert');
const chakram = require('chakram'),
    expect = chakram.expect;

const root = "http://localhost:3000"

describe("/products/list", () => {
    it("Returns a response", () => {
        const response = chakram.get(`${root}/products/list`)
        expect(response).to.have.status(200);
        return chakram.wait()
    });

    it("By default returns 5 items", () => chakram.get(`${root}/products/list`)
        .then(({ body }) => expect(body.length).to.equal(5))
    );

    it("Results update based on page & count parameters", () =>
        chakram.get(`${root}/products/list?page=2&count=10`)
            .then(({ body }) => {
                expect(body.length).to.equal(10)
                expect(body[0].id).to.not.equal(1)
            })
    );
});

describe("/products/:product_id", () => {
    it("Returns a response", () => {
        const response = chakram.get(`${root}/products/1`)
        expect(response).to.have.status(200);
        return chakram.wait()
    })
    it("Returns information for product id=1", () =>
        chakram.get(`${root}/products/1`)
            .then(({ body }) => {
                expect(body.id).to.equal(1)
                expect(body.name).to.equal("Camo Onesie")
                expect(body.features.length).to.equal(2)
            })
    )
})

describe("/products/:product_id/styles", () => {
    it("Returns a response", function () {
        const response = chakram.get(`${root}/products/1/styles`)
        expect(response).to.have.status(200);
        return chakram.wait()
    })
    it("Returns results array for product id=1", function () {
        chakram.get(`${root}/products/1/styles`)
            .then(({ body }) => expect(body.results).to.be.an("array"))
    })
    it("Returns correct style information for style id=1", function () {
        return chakram.get(`${root}/products/1/styles`)
            .then(({ body }) => {
                const style1 = body.results[0];
                expect(style1.style_id).to.equal(1)
                expect(style1.name).to.equal("Forest Green & Black")
                expect(style1.original_price).to.equal("140")
                expect(style1["default?"]).to.equal(1)
            })
    })
    it("Returns photos style id=1", function () {
        return chakram.get(`${root}/products/1/styles`)
            .then(({ body }) => expect(body.results[0].photos).to.be.an("array"))
    })
    it("Returns skus style id=1", function () {
        return chakram.get(`${root}/products/1/styles`)
            .then(({ body }) => expect(body.results[0].skus).to.be.an("object"))
    })
})

describe("/products/:product_id/related", () => {
    it("Returns a response", () => {
        const response = chakram.get(`${root}/products/1/related`)
        expect(response).to.have.status(200);
        return chakram.wait()
    })
    it("Returns related products for product id=1", () =>
        chakram.get(`${root}/products/1/related`)
            .then(({ body }) => {
                expect(body).to.be.an("array")
            })
    )
})