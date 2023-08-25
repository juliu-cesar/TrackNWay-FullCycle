package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	_ "github.com/go-sql-driver/mysql"
	"github.com/juliu-cesar/imersao-fullcycle/desafio/go/internal/route/entity"
	"github.com/juliu-cesar/imersao-fullcycle/desafio/go/internal/route/infra/repository"
)

func main() {
	db, err := sql.Open("mysql", "root:root@tcp(localhost:3306)/routes-challenge")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS routes (
			id INT AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(255),
			source JSON,
			destination JSON
			);
			`)
	if err != nil {
		panic(err)
	}

	r := chi.NewRouter()
	r.Post("/routes", CreateRoute)
	r.Get("/routes", ListRoutes)

	http.ListenAndServe(":8080", r)
}

func CreateRoute(w http.ResponseWriter, r *http.Request) {
	var route entity.Route
	err := json.NewDecoder(r.Body).Decode(&route)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	db, errDb := sql.Open("mysql", "root:root@tcp(localhost:3306)/routes-challenge")
	repo := repository.NewRouteRepositoryMysql(db)
	if errDb != nil {
		panic(errDb)
	}
	defer db.Close()

	err = repo.Create(&route)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintf(w, "Rota criada com sucesso!")

}

func ListRoutes(w http.ResponseWriter, r *http.Request) {
	db, errDb := sql.Open("mysql", "root:root@tcp(localhost:3306)/routes-challenge")
	repo := repository.NewRouteRepositoryMysql(db)
	if errDb != nil {
		panic(errDb)
	}
	defer db.Close()

	routes, err := repo.FindAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	jsonData, errJson := json.Marshal(routes)
	if errJson != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}
