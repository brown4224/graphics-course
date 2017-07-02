/**
 * Sean McGlincy
 * Graphics
 * Assignment 3
 * Summer 2017
 *
 * All files are included in this folder including libraries.
 *
 * The assignment has been broken up into multiple JS scripts for organization.
 * The shapes each have their own file and there are two spheres.
 * The first is the one that I used.  It uses a longitude and latitude coordinate system.
 * The 'sphere alt' is the example from the book.
 *
 * User can create Cubes, Sphere and Cone.  The user can pick to use the lighting shader or
 * just the vertex shader.  The program always calls the same shader but passes a shader flag to the shader
 * to determine what calculations to make.  Shaders do not have boolean logic, so the shader uses 0.0 or 1.0.
 *
 * The user can move the light source, color, camera and manipulate the two spheres. The user can adjust the
 * sphere's rotation to a limit.  The rotation speed can be adjusted in the render function for each axis.
 */