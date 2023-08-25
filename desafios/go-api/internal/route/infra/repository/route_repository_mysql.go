package repository

import (
	"database/sql"
	"encoding/json"

	"github.com/juliu-cesar/imersao-fullcycle/desafio/go/internal/route/entity"
)

type RouteRepositoryMysql struct {
	db *sql.DB
}

func NewRouteRepositoryMysql(db *sql.DB) *RouteRepositoryMysql {
	return &RouteRepositoryMysql{
		db: db,
	}
}

func (r *RouteRepositoryMysql) Create(route *entity.Route) error {
	sql := "INSERT INTO routes (name, source, destination) VALUES(?,?,?)"
	_, err := r.db.Exec(sql, route.Name, toJSON(route.Source), toJSON(route.Destination))
	if err != nil {
		return err
	}
	return nil
}

func (r *RouteRepositoryMysql) FindAll() ([]entity.Route, error) {
	sql := "SELECT * FROM routes;"
	rows, err := r.db.Query(sql)
	if err != nil {
		return nil, err
	}

	var routes []entity.Route
	for rows.Next() {
		var route entity.Route
		var sourceJSON, destinationJSON string
		err := rows.Scan(
			&route.ID,
			&route.Name,
			&sourceJSON,
			&destinationJSON,
		)
		if err != nil {
			return nil, err
		}
		route.Source = *fromJSON(sourceJSON)
		route.Destination = *fromJSON(destinationJSON)
		routes = append(routes, route)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return routes, nil
}

func toJSON(coord entity.Coordinates) string {
	jsonData, _ := json.Marshal(coord)
	return string(jsonData)
}
func fromJSON(jsonData string) *entity.Coordinates {
	var data entity.Coordinates
	_ = json.Unmarshal([]byte(jsonData), &data)
	return &data
}
