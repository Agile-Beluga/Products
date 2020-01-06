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
    it("Returns a response", () => {
        const response = chakram.get(`${root}/products/1/styles`)
        expect(response).to.have.status(200);
        return chakram.wait()
    })

    it("Returns results array for product id=1", () =>
        chakram.get(`${root}/products/1/styles`)
            .then(({ body }) => expect(body.results).to.be.an("array"))
    )

    it("Returns correct style information for style id=1", function () {
        this.timeout(10000)
        return chakram.get(`${root}/products/1/styles`)
            .then(({ body }) => {
                const style1 = body[0];
                expect(style1.style_id).to.equal(1)
                expect(style1.name).to.equal("Forest Green & Black")
                expect(style1.original_price).to.equal(140)
                expect(style1.default_item).to.equal(1)
            })
    })
    it("Returns photos style id=1", function () {
        this.timeout(10000)
        return chakram.get(`${root}/products/1/styles`)
            .then(({ body }) => expect(body[0].photos.length).to.equal(2))
    })
    it("Returns skus style id=1", function () {
        this.timeout(10000)
        return chakram.get(`${root}/products/1/styles`)
            .then(({ body }) => expect(body[0].skus.length).to.be.an("object"))
    })
})
