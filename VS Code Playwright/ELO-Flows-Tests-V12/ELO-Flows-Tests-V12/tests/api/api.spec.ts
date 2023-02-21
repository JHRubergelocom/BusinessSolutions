import { test, expect } from "@playwright/test";

test.describe.parallel("API Testing", () => {
  const baseURL = "http://vmdbsrv01:9090";
  //starten üblicherweise mit -> npm run tests:api
  // Konsolen-Log nur mit [npm run tests:api] ausführbar.
  //POST ist skiped. -> .skip löschen zum ausführen
  test("GET-request", async ({ request }) => {
    //Status
    const response = await request.get(`${baseURL}/flows/api/v1/status`);
    console.log(response);
    expect(response.status()).toBe(200);
  });
  //JSON-Text
  test("JSON-Text", async ({ request }) => {
    const response = await request.get(`${baseURL}/flows/api/v1/status`);
    expect(response.status()).toBe(200);
    const responseBody = JSON.parse(await response.text());
    console.log(responseBody);
  });

  //POST (QSEF-81)
  test.skip("POST-request", async ({ request }) => {
    const token = "80UJX5bA7v2bLE3TvrNV6PoQHS6bmx";
    const response = await request.post(
      `${baseURL}/ix-Repository1/plugin/de.elo.ix.plugin.proxy/flows/api/v1/trigger/com.elo.flows/ELOBase/v1/ObjectCreated?token=${token}`,
      {
        data: {
          color: 0,
          maskName: "SLA_Dateien",
          objId: "346",
          name: "",
          guid: "",
          maskId: "",
          acl: "",
          type: 258,
          objKeys: {
            ELO_PERSONALDATA_DELETEAT: "",
            ELO_PERSONALDATA_UID: "",
            ELO_FNAME: "",
          },
          changedMetadata: { name: "" },
          parentId: "",
        },
      }
    );
    expect(response.status()).toBe(200);
    const responseBody = JSON.parse(await response.text());
    console.log(responseBody);
  });
});

//http://vmdbsrv01:9090/ix-Repository1/plugin/de.elo.ix.plugin.proxy/flows/api/v1/trigger/com.elo.flows/ELOBase/v1/ObjectCreated?token={{FlowToken}}
//http://vmdbsrv01:9090/ix-Repository1/plugin/de.elo.ix.plugin.proxy/ac/ui/login/index.xhtml
