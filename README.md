# Charter Communications Table Demo

A generic table component, used in this demo to consume a Restaurants endpoint.

## Demo Link

https://charter-demo-jsbu4tjwu.vercel.app/

## Note:

Normally, I would implement logic for filtering and search at the database query level for fastest performance
and to ensure the data received on the client-side is the most up-to-date. But, for this use case, the sorting
and filtering logic has been kept at the Restaurants view level, as opposed to within the Table component
itself, to ensure reusability of the Table component for other resources.
