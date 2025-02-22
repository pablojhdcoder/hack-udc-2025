let dijkstra (graph : int option array array) (start : int) (finish : int) : (int * int list) option =
  let n = Array.length graph in
  let dist = Array.make n None in
  let pred = Array.make n None in
  let q = ref MinPrioQueue.empty in

  let rec aux () =
    match MinPrioQueue.extract !q with
    | None -> None
    | Some (d, u, q') ->
        q := q';
        if u = finish then
          let rec camino v acc =
            match pred.(v) with
            | None -> v :: acc
            | Some u' -> camino u' (v :: acc)
          in
          Some (d, camino finish [])
        else
          begin
            dist.(u) <- Some d;
            for v = 0 to n - 1 do
              match graph.(u).(v) with
              | None -> ()
              | Some w ->
                  let d' = d + w in
                  match dist.(v) with
                  | None ->
                      q := MinPrioQueue.insert !q d' v;
                      pred.(v) <- Some u
                  | Some d'' ->
                      if d' < d'' then
                        q := MinPrioQueue.insert !q d' v;
                        pred.(v) <- Some u
            done;
            aux ()
          end
  in
  q := MinPrioQueue.insert !q 0 start;
  aux ()

let w = let w = Array.make_matrix 5 5 None in
w.(0).(1) <- Some 7; w.(0).(3) <- Some 2; w.(1).(2) <- Some 1; w.(1).(3) <- Some 2;
w.(2).(4) <- Some 5; w.(3).(1) <- Some 3; w.(3).(2) <- Some 8; w.(3).(4) <- Some 5;
w.(4).(2) <- Some 4; w;;