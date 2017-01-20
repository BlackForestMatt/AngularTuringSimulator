Turing Machine Simulator:
-------------------
A Turing Machine consists in simple of a read-write head and an infinite tape on which the head can move.
The machine can have multiple states and must always be in one of these states.
One of these states must be the starting point of the machine and the machine can have multiple accepting endstates.

In one step the read-write-head can move one step left, right or stay in the same position.
In every step:
 - The read-write-head reads a symbol from the tape
 - The Machine changes its state
 - The read-write-head writes a symbol onto the tape
 - The read-write-head moves Left, Right or Neutral
 
How the machine decides what to do is defined by a partially defined function of the form: (z, a) -> z1, b, D with:
 - z  := the current state
 - a  := the current symbol
 - z1 := the new state to change into
 - b  := the new symbol to write
 - D  := the direction to move, with D in {<, -, >}
 
Definition using this simulator:
--------------------------------
To define a Turing Machine for this simulator:
  - A start state, with "start := "
  - A list of accepting states, with "end := {...}"
  - The symbol to use as blank, with "blank := "
  - A list of transition functions, defined as: "(z, a) -> (z1, b, D)" with D in {>, -, <}

States are defined just by using them as a start, end or transition state. They are created by the simulator while loading. States are only defined by their name.

Running the Angular-Simulator
--------------------------------
### Installing
```shell
$ npm install
```
### Run Angular
```shell
$ ng serve
```
License Information
-------------------
Turing Machine Simulator
Simulates a formal definition of a Turing Machine on a given input
Copyright (C) 2017  Matthias Mülhaupt and Josef Grieb

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

