package org.kinleoapple.auth

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import org.kinleoapple.util.generateSecretKey
import java.io.File
import java.util.*


object Auth {
    private var secretKey: ByteArray
    private var algorithm: Algorithm
    private val issuer = "ktor.io"
    private val validityInMs = 3600 * 1000 * 10 // 10 hours

    init {
        val secretKeyFile = File("./secretKey.key")
        if (!secretKeyFile.exists()) {
            initSecretKey(secretKeyFile)
        }
        secretKey = secretKeyFile.readBytes()
        algorithm = Algorithm.HMAC256(secretKey)
    }

    private fun initSecretKey(secretKeyFile: File) {
        val secretKey = generateSecretKey()
        secretKeyFile.createNewFile()
        secretKeyFile.writeBytes(secretKey)
    }

    fun makeJwtVerifier(): JWTVerifier = JWT
        .require(algorithm)
        .withIssuer(issuer)
        .build()

    fun sign(name: String, ip: String, ua: String): String {
        return makeToken(name, ip, ua)
    }

    private fun makeToken(name: String, ip: String, ua: String): String = JWT.create()
        .withSubject("Authentication")
        .withIssuer(issuer)
        .withClaim("name", name)
        .withClaim("ip", ip)
        .withClaim("ua", ua)
        .withExpiresAt(getExpiration())
        .sign(algorithm)

    private fun getExpiration() = Date(System.currentTimeMillis() + validityInMs)

}