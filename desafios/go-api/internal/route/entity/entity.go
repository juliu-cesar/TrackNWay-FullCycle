package entity

type Coordinates struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

type Route struct {
	ID          int         `json:"id"`
	Name        string      `json:"name"`
	Source      Coordinates `json:"source"`
	Destination Coordinates `json:"destination"`
}
