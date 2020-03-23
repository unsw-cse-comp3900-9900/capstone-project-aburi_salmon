import { Tables, Menu } from "./models";

const apiUrl = "http://localhost:5000";

export class Client {

  login(username: string, password: string) {
    return fetch(apiUrl + '/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      mode: 'cors'
    });
  }

  async getTables() {
    try {
      const r: Response = await fetch(apiUrl + '/table', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors'
      });

      const j: Tables = await r.json();

      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getMenu() {
    try {
      // const r: Response = await fetch(apiUrl + '/menu', {
      //   method: 'GET',
      //   credentials: 'include',
      //   mode: 'cors'
      // });

      // const j: Menu = await r.json();

      // return j;
      return {
        "menu": [
          {
            "cat": "Sushi",
            "item": [
              {
                "id": 1,
                "name": "Aburi Salmon",
                "description": "Nigiri sushi with flame seared salmon",
                "ingredient": [
                  "Salmon"
                ],
                "price": 4.5
              },
              {
                "id": 2,
                "name": "Dragon Roll",
                "description": "California roll topped with eel",
                "ingredient": [
                  "Avocado",
                  "Eel"
                ],
                "price": 2.5
              }
            ]
          },
          {
            "cat": "Dessert",
            "item": [
              {
                "id": 3,
                "name": "Matcha Mochi",
                "description": "Perfectly chewy with a hint of sweetness, Matcha Mochi is timeless Japanese sweet enjoyed by all ages.",
                "ingredient": [],
                "price": 3.5
              }
            ]
          }
        ]
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
