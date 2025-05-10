/**
 * Utility to wrap server actions with performance tracking
 */

"use server";

import { trackServerAction } from "./performance-tracer";
import * as todoActions from "@/actions/todoActions";
import * as formActions from "@/actions/formActions";
import * as weatherActions from "@/actions/weatherActions";

// Wrap todo actions with performance tracking
export const getTodos = trackServerAction(todoActions.getTodos, {
  name: "getTodos",
  trackResourceUsage: true,
});

export const addTodo = trackServerAction(todoActions.addTodo, {
  name: "addTodo",
  trackParams: true,
  trackResult: true,
  trackResourceUsage: true,
});

export const toggleTodo = trackServerAction(todoActions.toggleTodo, {
  name: "toggleTodo",
  trackParams: true,
  trackResult: true,
  trackResourceUsage: true,
});

export const deleteTodo = trackServerAction(todoActions.deleteTodo, {
  name: "deleteTodo",
  trackParams: true,
  trackResourceUsage: true,
});

// Wrap form actions with performance tracking
export const submitForm = trackServerAction(formActions.submitForm, {
  name: "submitForm",
  trackParams: true,
  trackResult: true,
  trackResourceUsage: true,
});

export const validateForm = trackServerAction(formActions.validateForm, {
  name: "validateForm",
  trackParams: true,
  trackResult: true,
  trackResourceUsage: true,
});

// Wrap weather actions with performance tracking
export const getWeather = trackServerAction(weatherActions.fetchWeatherData, {
  name: "fetchWeatherData",
  trackParams: true,
  trackResult: true,
  trackResourceUsage: true,
});
